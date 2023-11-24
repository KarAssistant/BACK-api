FROM node:18.13.0

# Install docker
RUN apt-get update
RUN apt-get install ca-certificates curl gnupg -y
RUN install -m 0755 -d /etc/apt/keyrings
RUN curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
RUN echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null
RUN apt-get update
RUN apt-get install docker-ce-cli -y

# Install node
# RUN set -uex; \
#     apt-get update; \
#     apt-get install -y ca-certificates curl gnupg; \
#     mkdir -p /etc/apt/keyrings; \
#     curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
#      | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg; \
#     NODE_MAJOR=18; \
#     echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" \
#      > /etc/apt/sources.list.d/nodesource.list; \
#     apt-get -qy update; \
#     apt-get -qy install nodejs;

COPY ./package*.json /data/Karassistant/
WORKDIR /data/Karassistant/
RUN npm install --omit=dev
RUN npm install @tensorflow/tfjs-node
COPY . .

ENTRYPOINT ["npm", "run"]
CMD ["startSever"]

