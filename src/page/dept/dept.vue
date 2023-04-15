<template>
    <div>
		<div class="title">
			<!-- <el-checkbox v-model="checked1" @change="chooseAll">选中全部</el-checkbox> -->
			<el-checkbox @change="expandAll">展开全部</el-checkbox>
		</div>
		<div class="flexlayout">
			<el-card shadow="hover" style="overflow:hidden;width:40%;">
				<el-tree
					ref="depttree"
					:data="data" show-checkbox
					node-key="id"
					:default-expanded-keys="expandData"
					accordion
					:expand-on-click-node="false"
					
					:render-content="renderContent"
					@node-click="nodeClick">
					<!--highlight-current default-expand-all -->
				</el-tree>
			</el-card>
			<el-card  shadow="hover" style="overflow:hidden;width:55%;">
				<el-input placeholder="请输入内容" v-model="inputDept" clearable/>
				<el-button @click="saveData">确定</el-button>
			</el-card>			
		</div>
    </div>
</template>
<script>

let id = 1000;
import {apiDept, updDept, addDept, delDept} from "@/api/data.js"; // 调用api 登录接口
export default {
	name: 'Dept',
	components: {

	},
	data() {
		return {
			//data: JSON.parse(JSON.stringify(data)),
			data : [
				{
					id: 1,
					label: '一级 1',
					children: [{
						id: 4,
						label: '二级 1-1',
						children: [{
							id: 9,
							label: '三级 1-1-1'
						}, 
						{
							id: 10,
							label: '三级 1-1-2'
						}]
					}]
				}, 
				{
					id: 2,
					label: '一级 2',
					children: [{
						id: 5,
						label: '二级 2-1'
					}, {
						id: 6,
						label: '二级 2-2'
					}]
				}, 
				{
					id: 3,
					label: '一级 3',
					children: [{
						id: 7,
						label: '二级 3-1'
					}, {
						id: 8,
						label: '二级 3-2'
					}]
				}
			],	
			expandData:[],
			inputDept:'',
			currNode:{},
			operMode:0,//0修改，1增加
			childArr:[],
		}
	},
    methods: {
		chooseAll(){
			// this.roleList = "";
			// // 判断按钮的状态
			// if (this.checked1) {
			// 	// 设置
			// 	this.$refs.tree.setCheckedNodes(this.data);
			// 	for (var i = 0; i < this.$refs.depttree.getCheckedNodes().length; i++) {
			// 		this.roleList += this.$refs.depttree.getCheckedNodes()[i].ID + ",";
			// 	}
			// 	this.roleList = this.roleList.slice(0, this.roleList.length - 1);
			// } else {
			// 	this.$refs.tree.setCheckedNodes([]);
			// 	this.roleList = "";
			// }
		},
		expandAll(){
			for (var i in this.$refs.depttree.store.nodesMap) {
				this.$refs.depttree.store.nodesMap[i].expanded = this.checked2;
			}
		},
		append(data) {
			// const newChild = { id: id++, label: 'testtest', children: [] };
			// if (!data.children) {
			// 	this.$set(data, 'children', []);
			// }
			// data.children.push(newChild);
			this.inputDept = '';
			this.operMode = 1;
		},
		getAllChild (obj) {
			if (Object.prototype.hasOwnProperty.call(obj, 'children')) {
				for (const item of obj.children) {
					if (Object.prototype.hasOwnProperty.call(item, 'children')) {
						this.childArr.push(item.id)
						this.getAllChild(item)
					} else {
						this.childArr.push(item.id)
					}
				}
				this.getAllChild(obj.children)
			} else {
				return null
			}
		},
		remove(node, data) {
			// let idlist = this.$refs.depttree.getCheckedKeys(true)
			console.log('node: ', node);
			console.log('data: ', data);
			this.childArr = [];
			this.getAllChild(data);
			this.childArr.push(data.id);

			// let ids = '';
			// for (let i = 0; i < this.childArr.length; i++) {
			// 	ids += this.childArr[i] + ','
			// }			
			// console.log('1111111 :' + ids);
			// if (ids.length > 0) {
			// 	if (ids.charAt(ids.length - 1)==','){
			// 		ids = ids.substring(0, ids.length - 1);
			// 	}
			// }
			// else {
			// 	return;
			// }
			// console.log('2222222 :' + ids);
			
			let indata = {ids:this.childArr};
			delDept(indata).then((resp) => {
                console.log(JSON.stringify(resp));
				const parent = node.parent;
				const children = parent.data.children || parent.data;
				const index = children.findIndex(d => d.id === data.id);
				children.splice(index, 1);
            }).catch((err) => {
                console.log("err==>", err);
            });				
		},
		nodeClick(data) {
			this.currNode = data;
			console.log(this.currNode);
			console.log(this.currNode.id+','+this.currNode.label);
			if (this.operMode == 0) {
				this.inputDept = this.currNode.label
			}
		},
		renderContent(h, { node, data, store }) {
			return (
				<span class="custom-tree-node">
				<span>{node.label}</span>
				<span>
					<el-button size="mini" type="text" on-click={ () => this.append(data) }>增加</el-button>
					<el-button size="mini" type="text" on-click={ () => this.remove(node, data) }>删除</el-button>
				</span>
				</span>
			);
		}, 

		fillDeptTree(node, deptData) {
			for(let i = 0; i < node.length; i++){	
				let tmpNode = node[i];	
				//console.log('tmpNode.id='+tmpNode.id+',label='+tmpNode.label);
				
				for(let j = 0; j < deptData.length; j++){
				//for (let j = deptData.length-1; j >= 0; j--){
					let dept = deptData[j];
					//console.log('dept.========'+j+','+deptData.length+','+dept);
					if (dept.parentid == tmpNode.id && dept.use == 0){//
						let tmpDept = {
							id: dept.deptid,
							label: dept.deptname,
						};
						console.log('dept.children========'+tmpNode.id+','+dept.deptid+','+dept.deptname+','+dept.parentid);
						if (Object.prototype.toString.call(tmpNode.children) == '[object Undefined]')
							tmpNode.children = [];									
						tmpNode.children.push(tmpDept);	
						//deptData.splice(j, 1);
						dept.use = 1;
						this.fillDeptTree(tmpNode.children, deptData);
					}
				}
			}
		},

		getCurrTime() {
			let myDate = new Date();//时间实例
			let H = myDate.getHours(); //获取小时
			let M = myDate.getMinutes(); //获取分钟
			let S = myDate.getSeconds();//获取秒
			let MS = myDate.getMilliseconds();//获取毫秒
			let milliSeconds = H * 3600 * 1000 + M * 60 * 1000 + S * 1000 + MS;
			return milliSeconds;
		},

		getDeptData() {
            let that = this;
            let indata = {};	
            apiDept(indata).then((resp) => {
                console.log(JSON.stringify(resp));
				let deptData = JSON.parse(JSON.stringify(resp.data));
				let begintime = that.getCurrTime();
				console.log("currtime..1.."+begintime);
				let maxLevel = 0;
				for(let i = 0; i < deptData.length; i++){
					let dept = deptData[i];
					dept.use = 0;
					maxLevel = maxLevel < dept.level ? dept.level : maxLevel;
				}

				let data = [];
				let tmpDept = {
					id: 0,
					label: 'MMCZ',
				};
				that.expandData.push(0);
				//that.expandData.push(1);
				//that.expandData.push(6);
				data.push(tmpDept);		
				that.fillDeptTree(data, deptData);
				let endtime = that.getCurrTime();
				console.log("currtime..2.."+begintime+','+endtime+','+(endtime-begintime));
				that.data = data;
            }).catch((err) => {
                console.log("err==>", err);
            });
		},
		saveData(){
			let that = this;
			if (this.operMode == 0) {
				this.currNode.label = this.inputDept;
				let indata = {
					deptid:this.currNode.id,
					deptname:this.currNode.label,
				};	
				updDept(indata).then((resp) => {
					console.log(JSON.stringify(resp));

					that.operMode = 0;
				}).catch((err) => {
					console.log("err==>", err);
				});	
			}
			else if (this.operMode == 1) {
				let indata = {
					parentid:this.currNode.id,
					deptname:this.inputDept,
				};	
				addDept(indata).then((resp) => {
					console.log(JSON.stringify(resp.data));
					let dept = resp.data;

					const newChild = {
						id: dept.deptid,
						label: dept.deptname, 
						children: [] 
					};
					if (!that.currNode.children) {
						that.$set(that.currNode, 'children', []);
					}
					that.currNode.children.push(newChild);

					that.operMode = 0;
					that.expandData.push(that.currNode.id);
				}).catch((err) => {
					console.log("err==>", err);
				});	
			}
			else {

			}
		}
    },
	mounted() {
		this.getDeptData();
	}
}

</script>

<style>
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}

.flexlayout {
    display: flex;
    flex-wrap: wrap;
	justify-content: space-between;	
}

.el-tree-node:focus > .el-tree-node__content {
	/* background-color: rgba(135, 206, 235, 0.3); */
	background-color: rgba(135, 206, 235, 0.1);
	/* background-color: linear-gradient(135deg, deeppink, dodgerblue); */
	color: #409eff; 
	font-weight: bold;
}
</style>