$.ajax({
    type: "GET",
    dataType: "json",
    url: '?json=1',
    timeout: 30000,
    success: function(data) {
        console.log(data.posts)

    },
    error: function() {
        console.log("数据加载失败")
    }
});