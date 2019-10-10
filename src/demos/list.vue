<template>
	<div class="app-container">
		<div class="header">
			<div class="curDate">
				排班日期：<el-date-picker
					v-model="curMonth"
					type="month"
					clearable
					value-format="yyyy-MM"
					placeholder="选择排班月份"
					:picker-options="pickerOptions"
					@change="chooseMonth"
				/>
				<el-button
					v-if="isShow"
					class="autobtn"
					type="primary"
					icon="el-icon-date"
					@click="autoPlan"
				>
					生成排班
				</el-button>
				<el-button
					v-if="isShow && tableList.length"
					type="primary"
					@click="savePlan"
				>
					保存
				</el-button>
				<el-button
					v-if="updateList.length"
					class="autobtn"
					type="primary"
					@click="updatePlanUser"
				>
					更新
				</el-button>
			</div>
		</div>
		<table
			class="table"
			bordercolor="#efefef"
			height="40"
			cellpadding="1"
			border="1"
		>
			<thead>
				<tr>
					<th v-if="headerList.length" class="head-th">
						<span>日期</span>
						<span>姓名</span>
					</th>
					<th
						v-for="(item, index) in headerList"
						:key="index"
						:class="['head-th', item.class]"
					>
						<span>{{ item.curDate }}</span>
						<span>{{ item.curWeek }}</span>
					</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(item, index) in names" :key="index">
					<td class="first-td">
						{{ item }}
					</td>
					<td
						v-for="(val, key) in tableList[index]"
						:key="key"
						:title="val.userName"
						:class="val.class"
					>
						{{ val.shiftName }}
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
import utils from 'utils'
// import { xingzhengSchedule } from "api/plan";
export default {
  components: {},
  data () {
    return {
      headerList: [],
      names: [],
      tableList: [],
      pickerOptions: {
        disabledDate (time) {
          return Date.now() > time.getTime()
        }
      },
      curMonth: '', // 当前年月,
      isShow: false, // 操作按钮显示条件
      dialogVisible: false, // 弹出框是否显示标识
      updateList: []
    }
  },
  methods: {
    detailPlan () {
      // const valid = `${date}-01`;
      // xingzhengSchedule({
      //   type: 2,
      //   valid
      // }).then(res => {
      //   this.showTable(date, res);
      // });
    },
    chooseMonth (val) {
      this.showDate = new Date(val)
      if (val) {
        this.detailPlan(val)
      } else {
        this.setData([])
        this.isShow = false
      }
    },
    updatePlanUser () {
      this.$confirm(`是否确定更新排班 ?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          console.log('update')
        })
        .catch(() => {
          console.log('取消')
        })
    },
    showTable (val, res) {
      const curMonthDays = utils.getCurMonthDays(val)
      const curMonth = parseInt(val.split('-')[1])
      const curDay = new Date(val).getDay()
      this.names = Object.keys(res)
      const values = Object.values(res)
      this.headerList = []
      const curList = []
      for (let i = 0; i < curMonthDays; i++) {
        const curWeek = ['日', '一', '二', '三', '四', '五', '六'][ (i + curDay) % 7 ]
        this.headerList.push({
          curDate: `${curMonth}月${i + 1}日`,
          curWeek: `星期${curWeek}`,
          class: curWeek === '日' || curWeek === '六' ? 'sun-plan' : ''
        })
        values.forEach((item, k) => {
          if (!curList[k]) {
            curList[k] = []
          }
          curList[k][i] = []
          let nflag = false
          item.forEach((v, n) => {
            const itemDate = v.date.substr(0, 10).split('-')
            if (
              curMonth === parseInt(itemDate[1]) &&
							i + 1 === parseInt(itemDate[2])
            ) {
              curList[k][i] = {
                userName: v.userName,
                shiftName: v.shiftName,
                shiftId: v.shiftId,
                userId: v.userId,
                class: curWeek === '日' || curWeek === '六' ? v.shiftName === '休' ? 'no-plan' : 'sun-plan' : v.shiftName === '休' ? 'no-plan' : ''
              }
              nflag = true
              values[k].splice(n, 1)
              return false
            }
          })
          if (!nflag) {
            curList[k][i] = {
              shiftName: '休',
              class: 'no-plan'
            }
          }
        })
      }
      console.log(curList)
      this.tableList = curList
    }
  }
}
</script>

<style lang="less">
.app-container {
	overflow: auto;
	padding-left: 0;
	padding-right: 0;
	margin: 0 20px;
	.curDate {
		line-height: 20px;
		text-align: center;
		margin-bottom: 20px;
		.autobtn {
			margin-left: 20px;
		}
	}
	.table {
		position: relative;
		border-collapse: collapse;
		background: #f8f8f8;
		// margin-left: 80px;
		// margin-top: 20px;
		// .head-th-fixed {
		//   position: fixed;
		//   top:20px;
		//   left:300px;
		//   z-index: 1000;
		// }
		min-height: 600px;
		display: inline-table;
		.head-th {
			color: #2c2c2c;
			padding: 5px 0;
			span {
				display: block;
				width: 80px;
			}
		}
		tbody {
			tr,
			td {
				text-align: center;
				padding: 5px;
				height: 20px;
				color: #2c2c2c;
				&.no-plan {
					color: #cccccc;
				}
			}
			.first-td {
				font-weight: bold;
			}
		}
		.sun-plan {
			background: #dbeaf9;
		}
	}
}
</style>
