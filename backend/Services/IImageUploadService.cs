using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Threading.Tasks;

namespace backend.Services
{
    public interface IImageUploadService
    {
        Task<string> UploadImageAsync(IFormFile file);
        Task DeleteImageAsync(string imageUrl);
    }

    public class CloudinaryImageUploadService : IImageUploadService
    {
        private readonly Cloudinary? _cloudinary;
        private readonly ILogger<CloudinaryImageUploadService> _logger;
        private readonly string _webRootPath;

        public CloudinaryImageUploadService(
            IConfiguration configuration, 
            ILogger<CloudinaryImageUploadService> logger, 
            IWebHostEnvironment env)
        {
            _logger = logger;
            _webRootPath = env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");

            // Look for standard CLOUDINARY_URL env var or configuration value
            var cloudinaryUrl = Environment.GetEnvironmentVariable("CLOUDINARY_URL") ?? configuration["CLOUDINARY_URL"];
            if (!string.IsNullOrEmpty(cloudinaryUrl))
            {
                try
                {
                    _cloudinary = new Cloudinary(cloudinaryUrl);
                    _cloudinary.Api.Secure = true;
                    _logger.LogInformation("Cloudinary service initialized successfully using CLOUDINARY_URL connection string.");
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to initialize Cloudinary with CLOUDINARY_URL connection string.");
                }
            }
            else
            {
                // Fallback to individual settings
                var cloudName = configuration["CloudinarySettings:CloudName"] ?? Environment.GetEnvironmentVariable("CloudinarySettings__CloudName");
                var apiKey = configuration["CloudinarySettings:ApiKey"] ?? Environment.GetEnvironmentVariable("CloudinarySettings__ApiKey");
                var apiSecret = configuration["CloudinarySettings:ApiSecret"] ?? Environment.GetEnvironmentVariable("CloudinarySettings__ApiSecret");

                if (!string.IsNullOrEmpty(cloudName) && !string.IsNullOrEmpty(apiKey) && !string.IsNullOrEmpty(apiSecret))
                {
                    try
                      {
                        var account = new Account(cloudName, apiKey, apiSecret);
                        _cloudinary = new Cloudinary(account);
                        _cloudinary.Api.Secure = true;
                        _logger.LogInformation("Cloudinary service initialized successfully using individual settings.");
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Failed to initialize Cloudinary with individual settings.");
                    }
                }
                else
                {
                    _logger.LogWarning("Cloudinary credentials are not configured. Image uploads will fall back to local disk storage in 'wwwroot/uploads'.");
                }
            }
        }

        public async Task<string> UploadImageAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("The uploaded file is empty.");

            // Fallback: If Cloudinary is not configured, save locally
            if (_cloudinary == null)
            {
                _logger.LogWarning("Cloudinary not configured. Storing image '{FileName}' on local disk fallback.", file.FileName);
                
                var uploadsFolder = Path.Combine(_webRootPath, "uploads");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var extension = Path.GetExtension(file.FileName);
                var uniqueFileName = $"{Guid.NewGuid():N}{extension}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var localStream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(localStream);
                }

                return $"/uploads/{uniqueFileName}";
            }

            // Otherwise, upload to Cloudinary
            using var stream = file.OpenReadStream();
            var uploadParams = new ImageUploadParams()
            {
                File = new FileDescription(file.FileName, stream),
                Folder = "gaurav-vastralay",
                Transformation = new Transformation().Quality("auto").FetchFormat("auto")
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);
            if (uploadResult.Error != null)
            {
                throw new Exception($"Cloudinary upload failed: {uploadResult.Error.Message}");
            }

            return uploadResult.SecureUrl.ToString();
        }

        public async Task DeleteImageAsync(string imageUrl)
        {
            if (string.IsNullOrEmpty(imageUrl)) return;

            // 1. Check if it's a local fallback file
            if (imageUrl.StartsWith("/uploads/", StringComparison.OrdinalIgnoreCase))
            {
                var localFilePath = Path.Combine(_webRootPath, imageUrl.TrimStart('/'));
                if (File.Exists(localFilePath))
                {
                    try
                    {
                        File.Delete(localFilePath);
                        _logger.LogInformation("Deleted local fallback image: {Path}", localFilePath);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Failed to delete local fallback image at: {Path}", localFilePath);
                    }
                }
                return;
            }

            // 2. Otherwise, check if it's a Cloudinary remote file and delete it
            if (_cloudinary == null) return;

            const string folderName = "gaurav-vastralay/";
            int folderIdx = imageUrl.IndexOf(folderName, StringComparison.OrdinalIgnoreCase);
            if (folderIdx == -1) return;

            string pathAndId = imageUrl.Substring(folderIdx); // "gaurav-vastralay/publicId.jpg"
            int dotIdx = pathAndId.LastIndexOf('.');
            if (dotIdx == -1) return;

            string publicId = pathAndId.Substring(0, dotIdx); // "gaurav-vastralay/publicId"

            try
            {
                var deletionParams = new DeletionParams(publicId);
                var deletionResult = await _cloudinary.DestroyAsync(deletionParams);
                _logger.LogInformation("Deleted Cloudinary image. Public ID: {PublicId}, Result: {Result}", publicId, deletionResult.Result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to delete image from Cloudinary. Public ID: {PublicId}", publicId);
            }
        }
    }
}
