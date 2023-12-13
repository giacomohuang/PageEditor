<template>
  <div class="footer-wrap" :class="data.style">
    <ul class="tabs">
      <template v-for="(item, index) in data.btns" :key="index">
        <li v-if="index < data.btnNum">
          <div class="wrap" :class="{ center: (data.style !== 'normal' && data.btnNum === 5 && index === 2) || (data.btnNum === 3 && index === 1) }">
            <div class="ico">
              <img
                :src="item.imgUrl || defaultImage"
                @error="
                  (e) => {
                    e.target.src = defaultImage
                  }
                "
              />
            </div>
            <div class="text">{{ item.title }}</div>
          </div>
        </li>
      </template>
    </ul>
    <div class="indicator"></div>
  </div>
</template>

<script setup>
import { inject, ref } from 'vue'
import defaultImage from '@/assets/img/defaultimage.png'
const data = inject('sectionFooter')
</script>

<style>
:root {
  --t-border-line: 1px solid #ccc;
}
</style>

<style scoped lang="scss">
.footer-wrap {
  position: relative;
}

.normal {
  background: #fff;
}

.rudder1 {
  background-color: #fff;
  .wrap.center {
    position: absolute;
    bottom: 12px;
    background-color: #fff;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    z-index: 1;
    border-top: var(--border-line);
    .ico {
      width: 48px;
      height: 48px;
      border-radius: 48px;
    }
    img {
      border-radius: 48px;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .text {
      position: absolute;
      bottom: -7px;
      margin-top: 15px;
    }
  }
}

.rudder2 {
  .tabs {
    border: 0;
  }

  &::before {
    content: '';
    display: inline;
    position: absolute;
    width: 150px;
    height: 83px;
    top: 0;
    left: 0;
    border-top-right-radius: 30px;
    background-color: #fff;
    border-top: var(--border-line);
  }
  &::after {
    content: '';
    display: inline;
    position: absolute;
    width: 150px;
    height: 83px;
    right: 0;
    top: 0;
    // z-index: 0;
    border-top-left-radius: 30px;
    background-color: #fff;
    border-top: var(--border-line);
  }

  .wrap.center {
    position: absolute;
    &::after {
      content: '';
      width: 80px;
      height: 83px;
      background: radial-gradient(circle at 50% 0px, transparent 44px, #fff 0) top left 100% no-repeat;
    }
    .ico {
      position: absolute;
      top: -30px;
      z-index: 2;
      // background: #dc3232;
      width: 65px;
      height: 65px;
      border-radius: 50%;
    }
    img {
      border-radius: 65px;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .text {
      display: none;
    }
  }
}

.tabs {
  height: 49px;
  position: relative;
  display: flex;
  justify-content: space-around;
  border-top: var(--border-line);

  li {
    position: relative;
    display: flex;
    justify-content: center;
    flex: 1;
  }

  .wrap {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;

    z-index: 1;
  }

  .ico {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 24px;
    height: 24px;
  }

  .text {
    z-index: 2;
    font-size: 12px;
    line-height: 100%;
    padding-top: 3px;
    color: #000;
  }
}

.indicator {
  height: 34px;
  display: flex;
  justify-content: center;
  &::after {
    z-index: 2;
    display: block;
    position: absolute;
    content: '';
    width: 134px;
    height: 5px;
    background-color: #000;
    border-radius: 10px;
    bottom: 8px;
  }
}
</style>
