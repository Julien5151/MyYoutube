## Scripts

- Up all services : `docker compose up -d`
- Stop all services : `docker compose stop`
- Destroy all services : `docker compose down`
- Up only DB : `docker compose up -d db`
- Stop only DB : `docker compose stop db`
- Down only DB : `docker compose down db`
- Up only API : `docker compose up -d app`
- Stop only API : `docker compose stop app`
- Down only API : `docker compose down app`
- Migrate DB : `dotnet dotnet-ef database update --project src/Infrastructure/Infrastructure.csproj --startup-project src/Application/Application.csproj --context Infrastructure.Database.MyYoutubeContext`
- Run solution for development (from Application directory) : `dotnet watch`
- Build docker image : ` docker build -t=my-youtube-app -f src/Application/Dockerfile .`
- Clean all docker containers and images : `docker system prune -af`