const Koa = require('koa');
const app = new Koa();
const KoaRouter = require('koa-router');
const router = new KoaRouter();
const usersData = require('./data/users.json');

const KoaStaticCache = require('koa-static-cache');
app.use(KoaStaticCache('./static', {
    gzip: true,
    dynamic: true
}));

router.get('/checkUserName', ctx => {
    let res = usersData.find(item => item.name === ctx.query.userName);
    if (res) {
        ctx.body = {
            status: 1,
            info: '用户名正确'
        }
    } else {
        ctx.body = {
            status: 2,
            info: '用户名错误'
        }
    }
});

app.use(router.routes());

app.listen(8080);