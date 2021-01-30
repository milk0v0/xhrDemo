const Koa = require('koa');
const app = new Koa();
const KoaRouter = require('koa-router');
const router = new KoaRouter();
const KoaBody = require('koa-body');
const usersData = require('./data/users.json');

const KoaStaticCache = require('koa-static-cache');
const koaBody = require('koa-body');
app.use(KoaStaticCache('./static', {
    gzip: true,
    dynamic: true
}));

app.use(koaBody({ multipart: true }));

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

router.get('/get/:id(\\d+)', ctx => {
    console.log(ctx.params);
    ctx.body = {
        static: 1,
        info: '请求成功'
    }
});

router.post('/post', ctx => {
    console.log(ctx.request.body);
    ctx.body = {
        static: 1,
        info: '请求成功'
    }
});

app.use(router.routes());

app.listen(8080);