# Stage 1: Build the Angular 20 Frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the ASP.NET Core 6 WebAPI & Data/Business Layers
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS backend-build
WORKDIR /src
COPY CareerCloud.Pocos/CareerCloud.Pocos.csproj CareerCloud.Pocos/
COPY CareerCloud.DataAccessLayer/CareerCloud.DataAccessLayer.csproj CareerCloud.DataAccessLayer/
COPY CareerCloud.EntityFrameworkDataAccess/CareerCloud.EntityFrameworkDataAccess.csproj CareerCloud.EntityFrameworkDataAccess/
COPY CareerCloud.BusinessLogicLayer/CareerCloud.BusinessLogicLayer.csproj CareerCloud.BusinessLogicLayer/
COPY CareerCloud.WebAPI/CareerCloud.WebAPI.csproj CareerCloud.WebAPI/
RUN dotnet restore CareerCloud.WebAPI/CareerCloud.WebAPI.csproj

COPY CareerCloud.Pocos/ CareerCloud.Pocos/
COPY CareerCloud.DataAccessLayer/ CareerCloud.DataAccessLayer/
COPY CareerCloud.EntityFrameworkDataAccess/ CareerCloud.EntityFrameworkDataAccess/
COPY CareerCloud.BusinessLogicLayer/ CareerCloud.BusinessLogicLayer/
COPY CareerCloud.WebAPI/ CareerCloud.WebAPI/
COPY --from=frontend-build /app/frontend/dist/frontend/browser/ CareerCloud.WebAPI/wwwroot/

RUN dotnet publish CareerCloud.WebAPI/CareerCloud.WebAPI.csproj -c Release -o /app/publish

# Stage 3: Production Runtime Image
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS runtime
WORKDIR /app
COPY --from=backend-build /app/publish ./
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "CareerCloud.WebAPI.dll"]
