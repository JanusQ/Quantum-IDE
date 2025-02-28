# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
# 创建目录
sudo mkdir -p /srv/frp
# 拷贝
sudo mv ~/frp_0.43.0_linux_amd64.tar.gz /srv/frp/
# 解压
sudo tar -zxvf frp_0.43.0_linux_amd64.tar.gz
# 修改frps.ini，frps.ini文件见下
sudo vim /srv/frp/frp_0.43.0_linux_amd64/frps.ini
# 配置frps frp server开机自启，frps.service文件内容在下面
sudo vim /etc/systemd/system/frps.service
# 创建日志保存文件夹
sudo mkdir /srv/frp/log
# 刷新服务列表
sudo systemctl daemon-reload
# 设置开机自启
sudo systemctl enable frps.service
# 启动服务
sudo systemctl start frps.service
# 停止服务
sudo systemctl stop frps.service
# 启动服务
sudo systemctl start frps.service
# 重启服务
sudo systemctl restart frps.service
# 查看状态
sudo systemctl status frps.service
# 查看是否设置开机自启
sudo systemctl is-enabled frps.service
# 关闭开机自启
sudo systemctl disable frps.service


# 检查可执行文件路径
ls -l /usr/frp_0.61.1_linux_amd64/frps

# 检查配置文件路径
ls -l /usr/frp_0.61.1_linux_amd64/frps.toml





cd /usr/frp_0.61.1_linux_amd64
./frps -c frps.toml