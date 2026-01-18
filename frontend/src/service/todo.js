import {createApi} from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";
import TodoList from "@/pages/TodoList";
export const TodoListsApi = createApi({
    reducerPath : "todoApi",
    baseQuery,
    tagTypes:['TodoLists'],
    endpoints : (builder) => ({
        getTodoList : builder.query({
            query:() => "/tasks",
            providesTags:['TodoLists']
        }),
        addTodoList : builder.mutation({
            query:(body) => ({
                url:"/tasks",
                method:"POST",
                body,
            }),
            invalidatesTags: ['TodoLists'],
        }),
        deleteTodoList : builder.mutation({
            query:(id) => ({
                url:`/tasks/${id}` ,
                method:"DELETE" , 
            }),
            invalidatesTags:[`TodoLists`]
        }),
        updateProducts : builder.mutation({
            query:({id,...patch}) => ({
                url : `/tasks/${id}`,
                method : "PATCH",
                body : patch
            }),
            invalidatesTags:[`TodoLists`]
        })
    })
})

export const {useGetTodoListQuery, 
              useAddTodoListMutation,
              useDeleteTodoListMutation, 
              useUpdateProductsMutation}  = TodoListsApi

