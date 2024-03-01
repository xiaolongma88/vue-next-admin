<script setup>
const tableData = [
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
  {
    date: '2016-05-03',
    name: '济南龙奥大厦',
    address: '济南市历下区龙鼎大道1号',
    value:'99999999',
    status:'使用',
    user:'zhangsan',
    useTime:'2023-12-5 2024-6-1',
    profit:'12000/月'
  },
]

</script>

<template>

  <el-table :data="tableData" height="800" style="width: 100%">
    <el-table-column prop="date" label="时间" width="180" />
    <el-table-column prop="name" label="名字" width="180" />
    <el-table-column prop="address" label="地址" />
    <el-table-column prop="value" label="估值" />
    <el-table-column prop="status" label="状态" />
    <el-table-column prop="user" label="使用人" />
    <el-table-column prop="useTime" label="使用时间段" />
    <el-table-column prop="profit" label="获利" />
  </el-table>
</template>

<style scoped lang="scss">

</style>