<template>
  <div class="footer-wrap" :class="data.style">
    <ul class="tabs">
      <li>
        <div class="wrap">
          <div class="ico"><icon id="#-ico-image" /></div>
          <div class="text">嘎嘎嘎嘎嘎</div>
        </div>
      </li>
      <li>
        <div class="wrap">
          <div class="ico"><icon id="#-ico-text" /></div>
          <div class="text">嘎嘎嘎嘎</div>
        </div>
      </li>
      <li>
        <div class="wrap center">
          <div class="ico"><icon id="#-ico-text" /></div>
          <div class="text">嘎嘎嘎嘎</div>
        </div>
      </li>
      <li>
        <div class="wrap">
          <div class="ico"><icon id="#-ico-carousel" /></div>
          <div class="text">嘎嘎嘎嘎</div>
        </div>
      </li>
      <li>
        <div class="wrap">
          <div class="ico"><icon id="#-ico-richtext" /></div>
          <div class="text">嘎嘎嘎嘎</div>
        </div>
      </li>
    </ul>
    <div class="indicator"></div>
  </div>
</template>

<script setup>
import { inject, ref } from 'vue'
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
    // box-shadow: -0px -1px 0 #ccc;

    .text {
      position: absolute;
      bottom: -13px;
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
      background: #dc3232;
      width: 65px;
      height: 65px;
      border-radius: 50%;
    }
    .icon {
      height: 40px;
      width: 40px;
      color: #fff;
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

  .ico {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .icon {
    z-index: 2;
    height: 32px;
    width: 32px;
  }

  .text {
    z-index: 2;
    font-size: 12px;
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
