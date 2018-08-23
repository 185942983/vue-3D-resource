<template>
  <div class="error-page">
      <div class="error-container error-container-star">
        <div class="star-1"></div>
        <div class="star-1"></div>
        <div class="star-1"></div>
        <div class="star-1"></div>
        <div class="star-1"></div>
        <div class="star-1"></div>
        <div class="star-1"></div>
        <div class="star-1"></div>
        <div class="star-1"></div>
        <div class="star-1"></div>
        <div class="star-1"></div>
        <div class="star-1"></div>
        <div class="star-1"></div>
        <div class="star-1"></div>
        <div class="star-1"></div>
        <div class="star-1"></div>
        <div class="star-1"></div>
        <div class="star-1"></div>
        <div class="star-1"></div>
        <div class="star-1"></div>
        <div class="star-1"></div>
        <div class="star-1"></div>
        <div class="star-1"></div>
        <div class="star-1"></div>
        <div class="star-1"></div>
        <div class="star-1"></div>
        <div class="star-1"></div>
        <div class="star-1"></div>
        <div class="star-1"></div>
        <div class="star-1"></div>
        <div class="star-2"></div>
        <div class="star-2"></div>
        <div class="star-2"></div>
        <div class="star-2"></div>
        <div class="star-2"></div>
        <div class="star-2"></div>
        <div class="star-2"></div>
        <div class="star-2"></div>
        <div class="star-2"></div>
        <div class="star-2"></div>
        <div class="star-2"></div>
        <div class="star-2"></div>
        <div class="star-2"></div>
        <div class="star-2"></div>
        <div class="star-2"></div>
        <div class="star-2"></div>
        <div class="star-2"></div>
        <div class="star-2"></div>
        <div class="star-2"></div>
        <div class="star-2"></div>
        <div class="star-2"></div>
        <div class="star-2"></div>
        <div class="star-2"></div>
        <div class="star-2"></div>
        <div class="star-2"></div>
        <div class="star-2"></div>
        <div class="star-2"></div>
        <div class="star-2"></div>
        <div class="star-2"></div>
        <div class="star-2"></div>
      </div>
      <div class="error-container error-container-bird">
        <div class="bird bird-anim">
          <div class="bird-container">
            <div class="wing wing-left">
              <div class="wing-left-top"></div>
            </div>
            <div class="wing wing-right">
              <div class="wing-right-top"></div>
            </div>
          </div>
        </div>
        <div class="bird bird-anim">
          <div class="bird-container">
            <div class="wing wing-left">
              <div class="wing-left-top"></div>
            </div>
            <div class="wing wing-right">
              <div class="wing-right-top"></div>
            </div>
          </div>
        </div>
        <div class="bird bird-anim">
          <div class="bird-container">
            <div class="wing wing-left">
              <div class="wing-left-top"></div>
            </div>
            <div class="wing wing-right">
              <div class="wing-right-top"></div>
            </div>
          </div>
        </div>
        <div class="bird bird-anim">
          <div class="bird-container">
            <div class="wing wing-left">
              <div class="wing-left-top"></div>
            </div>
            <div class="wing wing-right">
              <div class="wing-right-top"></div>
            </div>
          </div>
        </div>
        <div class="bird bird-anim">
          <div class="bird-container">
            <div class="wing wing-left">
              <div class="wing-left-top"></div>
            </div>
            <div class="wing wing-right">
              <div class="wing-right-top"></div>
            </div>
          </div>
        </div>
        <div class="bird bird-anim">
          <div class="bird-container">
            <div class="wing wing-left">
              <div class="wing-left-top"></div>
            </div>
            <div class="wing wing-right">
              <div class="wing-right-top"></div>
            </div>
          </div>
        </div>
        <div class="error-container-title">
          <div class="title">
            <div class="number">4</div>
            <div class="moon">
              <div class="face">
                <div class="mouth"></div>
                <div class="eyes">
                  <div class="eye-left"></div>
                  <div class="eye-right"></div>
                </div>
              </div>
            </div>
            <div class="number">4</div>
          </div>
          <div class="subtitle">Oops. Looks like you took a wrong turn.</div>
          <button @click="goBack">Go back</button>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  methods: {
      goBack(){
          this.$router.go(-1);
      }
  }
}
</script>

<style src="./fonts.css" scoped></style>
<style src="./style.css" scoped></style>
<style scoped>

    .error-page{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100%;
        height: 100%;
        background: #f3f3f3;
        box-sizing: border-box;
    }
</style>
