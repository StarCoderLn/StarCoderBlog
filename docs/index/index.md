---
title: '开始学习'
---

### 重塑数组 ###

```
var matrixReshape = function(nums, r, c) {
    let numsR = nums.length // 二维数组的行数
    let numsC = nums[0].length // 二维数组的列数
    let arr = [] // 存放二维数组所有元素的一维数组
    let res = []
    nums.forEach(num => {
        num.forEach(item => {
            arr.push(item) // 将二维数组转换成一维数组
        })
    })
    // 如何判断能否重塑数组才是解决问题的关键
    if (numsR * numsC === r * c) { // 判断二维数组的元素个数是否等于重塑数组的元素个数，相等才可以进行重塑，否则返回原数组
        for (let i = 0; i < r; i++) {
            res.push(arr.splice(0, c)) // 一行一行填充重塑数组
        }
    } else {
        return nums
    }
    return res
};
```