import request from '@/utils/request'

// export function getDepartments() {
//     return request({
//       url: '/company/department'
//     })
//   }


export function getDepartments() {
    return request({
      url: '/company/department'
    })
  }

/** *
 *  根据id根据部门  接口是根据restful的规则设计的   删除 delete  新增 post  修改put 获取 get
 * **/
export function delDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}

export function addDepartments(data) {
  return request({
    method: 'post',
    data,    //  axios 的body 参数 data
    url: '/company/department'
  })
}

export function getDepartDetail(id) {
  return request({
    url: `/company/department/${id}`
  })
}

/**
 * 编辑部门
 *
 * ***/
export function updateDepartments(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}