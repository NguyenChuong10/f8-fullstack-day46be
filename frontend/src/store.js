import {configureStore} from "@reduxjs/toolkit";
import { TodoListsApi } from "./service/todo";
const store = configureStore({
    reducer : {
        [TodoListsApi.reducerPath]: TodoListsApi.reducer,
    },
    middleware:(getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoreActions:[
                'TodoListApi/executeMutation/rejected',
                'TodoListApi/executeQuery/fulfilled',
            ],

            ignoredPaths: [
                'TodoListApi.mutations',
                'TodoListApi.queries'
            ]
        }
    }).concat(TodoListsApi.middleware),
})

export default store;