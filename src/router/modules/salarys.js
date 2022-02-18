//  员工的路由规则
//  所有路由规则是数组  单一路由规则是对象
import layout from '@/layout'
export default {
    path: '/salarys',  //  路由地址
    name: 'salarys',
    component: layout,
    children: [{
        //  二级路由的 path 不写表示二级路由为默认路由  自动引用
        path: '',  //  这里不写 表示 /salarys 不但有布局 还有layout => 员工主页
        component: () => import('@/views/salarys'),
        // 路由元信息 用来存储数据对象
        meta: {
            title:'工资',
            icon:'money'
            //  左侧导航读取了这里的 title 属性
        }
    }]
}