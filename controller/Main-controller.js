app.controller('MainController', function ($scope, $http, $window, API_BASE_URL) {
    // Toastify helper

    // app.controller("ExampleController", function ($scope, ApiService) {
    //     $scope.loadData = async function () {
    //         try {
    //             const result = await ApiService.call('/users', 'GET');
    //             console.log(result);
    //         } catch (e) {
    //             console.error('Call failed', e);
    //         }
    //     };

    //     $scope.createUser = async function () {
    //         try {
    //             const payload = { email: "a@gmail.com", name: "Tuan" };
    //             const res = await ApiService.call('/register', 'POST', payload);
    //             console.log(res);
    //         } catch (e) {
    //             console.error('Create failed', e);
    //         }
    //     };
    // });


    // $scope.saveData = async function () {
    //     try {
    //         const result = await ApiService.call('/save', 'POST', { name: $scope.name });
    //         await ToastService.show("Saved successfully!", "success");
    //     } catch (err) {
    //         await ToastService.show("Failed to save!", "error");
    //     }
    // };

});
