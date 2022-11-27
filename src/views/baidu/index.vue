<template>
  <div class="dash-container">
    <el-row :gutter="10">
      <el-col :span="6">
        <el-form :mode="bounds" :label-position="left" :size="small" :rules="rules">
            <el-form-item label="Lng1" prop="lng1">
              <el-input v-model="params.bounds.lng1" placeholder="左下经度"/>
            </el-form-item>
            <el-form-item label="Lat1" prop="lat1">
              <el-input v-model="params.bounds.lat1" placeholder="左下纬度"/>
            </el-form-item>
            <el-form-item label="Lng2" prop="lng2">
              <el-input v-model="params.bounds.lng2" placeholder="右上经度"/>
            </el-form-item>
            <el-form-item label="Lat2" prop="lat2">
              <el-input v-model="params.bounds.lat2" placeholder="右上纬度"/>
            </el-form-item>
            <el-form-item label="Accuracy" prop="accuracy">
              <el-input-number v-model="params.accuracy" :min="1" />
            </el-form-item>
            <el-form-item style="">
              <el-button type="primary" @click="handlerGenBaiduGrid">生成栅格</el-button>
              <el-button type="warning" @click="toggle('polyline')">{{ polyline.editing ? '停止绘制' : '开始绘制' }}</el-button>
              <el-button type="success" @click="submitPoints">发送航点</el-button>  
            </el-form-item>          
        </el-form>
        <el-table :data="coords" border highlight-current-row max-height="440">
          <el-table-column type="index" />
          <!-- <el-table-column prop="lng" label="Lng" />
          <el-table-column prop="lat" label="Lat" /> -->
          <el-table-column #default="scope" label="Lng">
            <el-input v-model="scope.row.lng" />
          </el-table-column>
          <el-table-column #default="scope" label="Lat">
            <el-input v-model="scope.row.lat" />
          </el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button type="danger" plain @click="deletePoint(scope.$index)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="18">
        <!-- <div id="map" class="bm-view"> -->
          <baidu-map
            id="'grid"
            class="bm-view"
            :center="center"
            :zoom="18"
            :map-type="mapType"
            @ready="handler"
            @click="paintPolyline"
          >
          <bm-marker :position="coord" v-for="(coord, index) in coords" :key="coord" dragging="true" @mousedown="movePointBefore(index)" @dragging="movePoint">
            <bm-label :content="index + 1" />
          </bm-marker>
          <bm-polyline :path="coords" stroke-color="blue" :stroke-opacity="1" :stroke-weight="2" @lineupdate="updatePolylinePath"></bm-polyline>
          </baidu-map>
        <!-- </div> -->
      </el-col>
    </el-row>
  </div>
</template>
<script>
// eslint-disable-next-line no-unused-vars
import BaiduMap from "vue-baidu-map-3x";
import { baiduGenGrid, uploadPoints } from "@/apis/baidu";
export default {
  name: 'BaiduGrid',
  data() {
    return {
      params: {
        bounds: {
          lng1: 119.37098775602607,
          lat1: 32.11655934651841,
          lng2: 119.37609501851392,
          lat2: 32.12293903313633
        },
        accuracy: 10,
      },
      center: {
        lng: '',
        lat: ''
      },
      polyline: {
        editing: false,
        paths: []
      },
      data: [],
      layer: undefined,
      coords: [],
      showCoord: false,
      tempIndex: 0,
      zoom: 13,
      scale: 16,
      mapType: "BMAP_SATELLITE_MAP",
      options: {
        fillStyle: "white",
        strokeStyle: "yellow",
        size: 3,
        lineWidth: 1,
        draw: "simple",
        globalAlpha: 0.5,
      },
      rules: {
        lng1: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        lat1: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        lng2: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        lat2: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        accuracy: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ]
      }
    };
  },

  created(){
    this.getData()
  },

  methods: {
    async getData(){
      const _this = this
      let params = {
        bounds: [_this.params.bounds.lng1, _this.params.bounds.lat1, _this.params.bounds.lng2, _this.params.bounds.lat2],
        accuracy: _this.params.accuracy
      };
      await baiduGenGrid(params).then(re=>{
        _this.data = re.data
      })
    },

    handler({BMap, map}) {
      const _this = this
      // map = new BMap.Map("grid", {
      //   enableMapClick: false
      // })
      map.centerAndZoom(new BMap.Point(119.373175, 32.119817), 18);
      map.enableScrollWheelZoom(true);
      // eslint-disable-next-line no-undef
      const mapv = require("mapv");
      const grid = _this.data;
      const dataSet = new mapv.DataSet(grid);
      // eslint-disable-next-line no-unused-vars
      _this.layer = new mapv.baiduMapLayer(map, dataSet, _this.options);
    },

    getMapCenter(e) {
      this.lng = e.target.getCenter().lng;
      this.lat = e.target.getCenter().lat;
      if (this.zoom >= this.scale) {
        this.mapType = "BMAP_SATELLITE_MAP";
      }
    },

    async handlerGenBaiduGrid() {
      const _this = this
      if (_this.params.accuracy < 0) {
          _this.$message({
            message: '栅格精确度不能小于0',
            type: 'warning'
          })
      }
      const params = {
        bounds: [_this.params.bounds.lng1, _this.params.bounds.lat1, _this.params.bounds.lng2, _this.params.bounds.lat2],
        accuracy: _this.params.accuracy
      }
      baiduGenGrid(params).then(re=>{
        _this.layer.dataSet.set(re.data)
      })
    },

    toggle (name) {
      this[name].editing = !this[name].editing
    },
    paintPolyline (e) {
      if (!this.polyline.editing) {
        return
      }
      this.coords.push(
        {
          lng: e.point.lng,
          lat: e.point.lat
        }
      )
    },
    infoWindowClose () {
      this.show = false
    },
    infoWindowOpen () {
      this.show = true
    },
    clickHandler (e) {
      alert(`单击点的坐标为：${e.point.lng}, ${e.point.lat}`);
    },
    updatePolylinePath (e) {
      this.polylinePath = e.target.getPath()
    },
    movePointBefore(index){
      this.tempIndex = index
    },
    movePoint(e){
        this.coords[this.tempIndex].lng = e.point.lng
        this.coords[this.tempIndex].lat = e.point.lat
    },
    deletePoint(i){
      this.coords.splice(i, 1)
    },
    submitPoints(){
      uploadPoints({points: this.coords}).then(re => {
        console.log(re.data)
      })
    }
  },

};
</script>
<style>
.dash-container {
  text-align: center;
}
.map {
  padding-top: 30px;
}
.bm-view {
  width: 100%;
  height: 800px;
}
</style>
