import Mock from 'mockjs'
import '@/mock/menu.js'
// 定义模拟数据
Mock.mock('/api/login', 'post', (req) => {
    const { username, password } = JSON.parse(req.body)
    return {
        status: 200,
        msg: '登录成功',
        data: {
            Authorization: 'fake-token'
        }
    }
})
Mock.mock('/api/user/auth', 'post', (req) => {
    return {
        status: 200,
        msg: '成功',
        data: {
            signature: 'fake-signature'
        }
    }
})
Mock.mock('/api/user/info', 'post', (req) => {
    return {
        status: 200,
        msg: '成功',
        data: {

        }
    }
})

