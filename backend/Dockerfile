# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy project file and restore dependencies
COPY ["backend.csproj", "."]
RUN dotnet restore "./backend.csproj"

# Copy everything and publish
COPY . .
RUN dotnet publish "backend.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

# Copy published output
COPY --from=build /app/publish .

# Render uses port 10000 by default for Docker containers
ENV ASPNETCORE_URLS=http://+:10000

ENTRYPOINT ["dotnet", "backend.dll"]
