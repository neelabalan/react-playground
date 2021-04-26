const vm = new Vue({
    el: "#app",
    data: {
        data: [],
        message: ""
    },
    computed: {
        csvData() {
            return this.data.map(item => ({
                ...item
            }));
        }
    },
    methods: {
        csvExport(arrData) {
            let csvContent = "data:text/csv;charset=utf-8,";
            csvContent += [
                Object.keys(arrData[0]).join(";"),
                ...arrData.map(item => Object.values(item).join(";"))
            ]
                .join("\n")
                .replace(/(^\[)|(\]$)/gm, "");

            const data = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", data);
            link.setAttribute("download", "export.csv");
            link.click();
        },
        inputSearch() {
            fetch("http://localhost:8000/v1/?search="+ this.message)
                .then(resp => resp.json())
                .then(json => (this.data = json))
        }
    },
    mounted() {
        fetch("http://127.0.0.1:8000/v1/?search=*")
        .then(resp => resp.json())
        .then(json => (this.data = json))
    }
});
