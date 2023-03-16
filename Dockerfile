# use official node parent image
FROM node:14.20.0
# set container working directory
WORKDIR /theme
# install the cli
RUN npm -g config set user root
RUN npm install -g @bigcommerce/stencil-cli
# publish cli default port
EXPOSE 3000