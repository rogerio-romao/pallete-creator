<template>
  <nav>
    <div class="brand">
      <span>
        <img src="../assets/logo.png" alt="logo" id="logo" />
      </span>
      <span> Color Pallete Creator </span>
    </div>
    <div class="nav-links">
      <ul>
        <li>Login</li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {};
</script>

<style>
nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  background-color: #435;
  color: var(--text-light);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.33);
}

.brand {
  font-family: "Zen Antique", serif;
  font-size: 1.4rem;
  font-weight: 600;
}

#logo {
  display: inline-block;
  width: 24px;
  height: 24px;
  filter: invert(0.72);
  margin-right: 0.3rem;
  margin-bottom: -4px;
}
</style>