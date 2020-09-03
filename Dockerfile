FROM node:erbium as staticassets

RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-unstable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf \
      --no-install-recommends

RUN apt-get -y install libxss1 \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir /app
ADD . /app
WORKDIR /app
ENV PORT 8080
ENV NODE_ENV production

RUN yarn \
    && groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app
RUN echo kernel.unprivileged_userns_clone=1 > /etc/sysctl.d/00-local-userns.conf
        
USER pptruser
CMD [ "node", "index.js" ]
