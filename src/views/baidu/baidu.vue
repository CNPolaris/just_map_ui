<template>
  <div class="dash-container">
    <el-row :gutter="10">
      <el-col :span="4">
        <el-form :mode="bounds" :inline="true" :label-position="right" :rules="rules">
            <el-form-item label="lng1" prop="lng1">
              <el-input v-model="params.bounds.lng1" placeholder="左下经度"/>
            </el-form-item>
            <el-form-item label="lat1" prop="lat1">
              <el-input v-model="params.bounds.lat1" placeholder="左下纬度"/>
            </el-form-item>
            <el-form-item label="lng2" prop="lng2">
              <el-input v-model="params.bounds.lng2" placeholder="右上经度"/>
            </el-form-item>
            <el-form-item label="lat2" prop="lat2">
              <el-input v-model="params.bounds.lat2" placeholder="右上纬度"/>
            </el-form-item>
            <el-form-item label="accuracy" prop="accuracy">
              <el-input-number v-model="params.accuracy" :min="1" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handlerGenBaiduGrid">生成栅格</el-button>
            </el-form-item>            
        </el-form>
      </el-col>
      <el-col :span="20">
        <div id="map" class="bm-view">
          <baidu-map
            id="'grid"
            class="bm-view"
            :center="center"
            :zoom="18"
            :map-type="mapType"
            @ready="handler"
          >
          </baidu-map>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
// eslint-disable-next-line no-unused-vars
import BaiduMap from "vue-baidu-map-3x";
import { baiduGenGrid3, baiduGenGrid4 } from "@/apis/baidu";
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
      data: [],
      mapObj: undefined,
      map: undefined,
      mapv: undefined,
      layer: undefined,
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
      await baiduGenGrid4(params).then(re=>{
        _this.data = re.data
      })
    },
    handler({BMap, map}) {
      const _this = this
      map = new BMap.Map("map", {
        enableMapClick: false
      })
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
      };
      baiduGenGrid4(params).then(re=>{
        _this.layer.dataSet.set(re.data)
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
