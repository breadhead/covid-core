# oncohelp-core

## Development
+ `git clone`
+ `yarn`
+ `yarn start:dev`

### Checks
+ `yarn test` to run unit tests
+ `yarn test:e2e` to run end-to-end tests
+ `yarn lint` to check code-style

### Docker
`docker-compose up` to run docker container

### Evolutions

If app production ready you must use `evolutions` for preparing DB.

+ `yarn evolutions --init` to init db at first time
+ `yarn evolutions` to upgrade db after every changing

### Commands

`yarn cmd` execute a command in app

#### List
+ `yarn cmd doctor email@email.com 'Pas$w0rd' '--name=Николай Сергеевич' --boardUsername=sdfjk '--desciption=Самый лучший онколог на свете'`

### Docs
`localhost:3000/docs`