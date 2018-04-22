import fetch from 'node-fetch';
import cheerio from 'cheerio';
import Raven from 'raven';

Raven.config(
    'https://3feb8b95c583427ba5c82d1796644c2d@sentry.io/1193874',
).install();

let latestWordcount = 0;

const update = () =>
    fetch('https://blog.sjm.computer/wordcount')
        .then(req => req.text())
        .then(body => cheerio.load(body))
        .then($ => $('#wordcount').text())
        .then(value => {
            latestWordcount = parseInt(value, 10);
            return value;
        })
        .then(value =>
            fetch(
                `https://www.beeminder.com/api/v1/users/samiswellcool/goals/published-words/datapoints.json?auth_token=${
                    process.env.BEEMINDER_AUTH_TOKEN
                }&value=${value}`,
                {
                    method: 'POST',
                },
            ),
        )
        .then(res => res.json())
        .then(x => console.log(x))
        .catch(e => console.error(e));

update();

setInterval(update, 1000 * 60 * 60);

export default () => `running...wc ${latestWordcount}`;
