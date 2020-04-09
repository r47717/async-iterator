const axios = require("axios");

const fetcher = {
  urls: [
    "https://developer.mozilla.org/",
    "https://yandex.ru/",
    "https://www.google.com/",
    "https://github.com/",
    "https://about.gitlab.com/",
  ],

  [Symbol.asyncIterator]() {
    return {
      urls: this.urls,
      current: 0,
      async next() {
        if (this.current < this.urls.length) {
          try {
            const response = await axios(this.urls[this.current++]);
            const chunked =
              response.headers["transfer-encoding"] &&
              response.headers["transfer-encoding"] === "chunked";

            return {
              done: false,
              value: chunked ? "chunked" : response.headers["content-length"],
            };
          } catch (err) {
            console.log(err);
          }
        }

        return {
          done: true,
        };
      },
    };
  },
};

(async function fetch() {
  for await (const len of fetcher) {
    console.log(len);
  }
})();
