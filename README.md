# auto-deploy-wxapp
Auto deploy wxapp to wx editor



This project contains two part codes, the client side and the server side.

The client side is the chrome extension crx, it collect and submit data.

The server side is a websocket server which is listening to the crx connect and run the auto deploy process.



The `/dist/crx` folder contains the packaged crx file，so to install to the chromium browser directly. And the `/dist/server` folder contains a exe program, it's a packaged websocket server, to run it in windows system.