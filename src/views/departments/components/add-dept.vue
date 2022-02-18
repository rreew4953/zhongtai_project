<template>
  <!-- 新增部门的弹层 -->
    <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form ref="deptForm" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code"  style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select @focus.native="getEmpolyeeSimple" v-model="formData.manager" style="width:80%" placeholder="请选择" />
        <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button @click="btnOK" type="primary" size="small">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments,addDepartments,getDepartDetail, updateDepartments } from '@/api/departments.js'
import { getEmpolyeeSimple } from '@/api/employees.js'
    export default {
      props: {
        showDialog: {
        type: Boolean,
        default: false
        }
    },
    treeNode: {
      type: Object,
      default: null
    }
    ,
    data() {
      //  检查部门名称是否重复
      const checkNameRepeat = async (rule ,value , callback) => {  // value 是部门名称  和同级部门比较 相同的不能通过
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.formData.id) {
        isRepeat = depts.filter(item => item.pid === this.treeNode.id && item.id !== this.treeNode.id).some(item => item.name === value)
      } else {
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }
      
      //  如果 isrepeat 为true 则有一样的名字
      //  找到同级部门
      isRepeat ? callback(new Error(`同级部门已存在${value}`)) : callback()
      }
      const checkCodeRepeat = async (rule, value, callback) => {
        const { depts } = await getDepartments()
        let isRepeat = false
        if (this.formData.id) {
          isRepeat = depts.filter(item => item.id !== this.treeNode.id).some(item => item.code === value && value)
        } else {
          isRepeat = depts.some(item => item.code === value && value)
        }
        //  要求编码和所有的部门编码不重复
        //  由于历史数据可能没有code 所有需要加一个强制条件 value不为空
        
        isRepeat ? callback(new Error(`阻止架构下已存在${value}`)) : callback()
      }
    return {
      // 定义表单数据
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      // 定义校验规则
      rules: {  //  校验规则 key ：数组
        name: [{ required: true, message: '部门名称不能为空',},
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur'},{
          trigger: 'blur',
          validator: checkNameRepeat
          }],
        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' },
          {
          trigger: 'blur',
          validator: checkCodeRepeat
          }],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { trigger: 'blur', min: 1, max: 300, message: '部门介绍要求1-50个字符' }]
      },
      peoples: [] // 接收获取的员工简单列表的数据
    }
  },
  computed: {
    showTitle () {
      return this.formData.id ? '编辑部门' : '新增子部门'
    }
  },
    methods: {
    // 获取员工简单列表数据
    async  getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
    },
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id)
    },
     // 点击确定时触发
     btnOK() {
      this.$refs.deptForm.validate(async isOK => {
        if (isOK) {
          // 表示可以提交了
          if (this.formData.id) {
            //  编辑
          await updateDepartments(this.formData)
          } else {
            await addDepartments({ ...this.formData, pid: this.treeNode.id }) // 调用新增接口 添加父部门的id
          }
        }
      })
    },
      btnCancel() {
      // 重置数据  因为resetFields 只能重置 表单上的数据 非表单上的 比如 编辑中id 不能重置
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      // 关闭弹层
      this.$emit('update:showDialog', false)
      // 清除之前的校验  可以重置数据 只能重置 定义在data中的数据
      this.$refs.deptForm.resetFields()
    }
  }
}
</script>