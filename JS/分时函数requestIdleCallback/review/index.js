const btn = document.querySelector('.btn')
const datas = Array.from({ length: 100000 }, (_, i) => i)

btn.onclick = function () {
    performChunk(0)
}

let timer = null
//使用setTimeout或requestAnimationFrame方式实现分时函数
function performChunk(count) {
    if (count > datas.length) return cancelAnimationFrame(timer)
    let total = count + 1000
    for (let i = count; i < total; i++) {
        const div = document.createElement('div')
        div.textContent = datas[i]
        document.body.appendChild(div)
    }
    timer = requestAnimationFrame(() => {
        performChunk(total)
    })
}

//使用requestIdleCallback
