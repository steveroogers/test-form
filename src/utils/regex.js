export const email =
  /^(([a-zA-Z0-9.+-_]+)*([a-zA-Z0-9]+))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const specialCharactersAndNumbers =
  /[\s\d!@#$^&%*()+=[\]{}|:<>?,._';"/\\~`]+/;

export const isUrl = /(http(s?)):\/\//i;

export const isMobile =
  /Android.+Mobile|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i;
