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
- Migrate DB : `dotnet dotnet-ef database update`
- Run solution for development : `dotnet watch`
- Build docker image : `docker build . -t=my-youtube-app`
- Clean all docker containers and images : `docker system prune -af`