## Scripts

- Up all services : `docker compose up -d`
- Stop all services : `docker compose stop`
- Destroy all services : `docker compose down`
- Up only one service : `docker compose up -d <service-name>`
- Stop only one service : `docker compose stop <service-name>`
- Down only one service : `docker compose down <service-name>`
- Migrate my-youtube DB : `dotnet dotnet-ef database update --project src/Infrastructure/Infrastructure.csproj --startup-project src/Application/Application.csproj --context Infrastructure.Database.MyYoutubeContext`
- Run my-youtube solution for development (from Application directory) : `dotnet watch`
- Build my-youtube docker image : `docker build -t=my-youtube-app -f src/Application/Dockerfile .`
- Clean all docker containers and images : `docker system prune -af`
