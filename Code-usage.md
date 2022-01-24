# On local

- ## Backend

  - `cd localparty`
  - `pip install -r requirements.txt`
  - `redis-server`
  - `python manage.py runserver`

- ## Frontend

  - `cd syncplayer`
  - `npm start`

# Deploy:

- `git init`
- `heroku login`

- ## Backend

  - `heroku create app-name`
  - `heroku git:remote -a app-name`
  - `git add .`
  - `git commit -m "Backend deployment"`
  - `heroku buildpacks:add heroku/python`
  - `heroku buildpacks:add --index 1 https://github.com/heroku/heroku-buildpack-multi-procfile`
  - `heroku config:set PROCFILE=localparty/Procfile`
  - `git push heroku master`

- ## Frontend

  - `heroku create frontend-app-name -b https://github.com/mars/create-react-app-buildpack.git`
  - `heroku git:remote -a frontend-app-name`
  - `git add .`
  - `git commit -m "Frontend deployment"`
  - `cd syncplayer/`
  - `npm run publishToHeroku`
