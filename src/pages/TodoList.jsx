import { Button } from "@/components/ui/button";
import {useAddTodoListMutation,useDeleteTodoListMutation,useGetTodoListQuery,useUpdateProductsMutation} from "@/service/todo";
import { useState } from "react";
import { useForm } from "react-hook-form";

function TodoList() {
    // State quản lý edit
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editTitle, setEditTitle] = useState("");

    // RTK Query hooks
    const { isLoading, data } = useGetTodoListQuery();
    const [createTasks, { isLoading: isCreating }] = useAddTodoListMutation();
    const [deleteTasks, { isLoading: isDeleting }] = useDeleteTodoListMutation();
    const [updateTasks, { isLoading: isUpdating }] = useUpdateProductsMutation();

    // React Hook Form
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            title: ""
        }
    });

    // Thêm công việc mới
    const onSubmit = async (formData) => {
        try {
            await createTasks({
                title: formData.title
            }).unwrap();
            reset();
            console.log("Thêm công việc thành công!");
        } catch (error) {
            console.log("Lỗi khi thêm:", error);
            console.log(`Có lỗi xảy ra: ${error?.data?.message || error?.message || 'Không thể thêm công việc'}`);
        }
    }

    // Bật chế độ edit
    const handleEdit = (item) => {
        setEditingTaskId(item.id);
        setEditTitle(item.title);
    }

    // Hủy edit
    const handleCancelEdit = () => {
        setEditingTaskId(null);
        setEditTitle("");
    }

    // Lưu chỉnh sửa
    const handleSaveEdit = async (id) => {
        if (!editTitle.trim()) {
            console.log("Tiêu đề không được để trống!");
            return;
        }

        try {
            await updateTasks({
                id: id,
                title: editTitle
            }).unwrap();
            setEditingTaskId(null);
            setEditTitle("");
            console.log("Cập nhật thành công!");
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
            console.log(`Có lỗi xảy ra: ${error?.data?.message || error?.message || 'Không thể cập nhật'}`);
        }
    }

    // Toggle hoàn thành
    const handleToggleComplete = async (item) => {
        try {
            await updateTasks({
                id: item.id,
                isCompleted: !item.isCompleted
            }).unwrap();
            console.log("Cập nhật trạng thái thành công!");
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái:", error);
            console.log(`Có lỗi xảy ra: ${error?.data?.message || error?.message || 'Không thể cập nhật'}`);
        }
    }

    // Xóa công việc
    const handleDelete = async (id) => {
        try {
            await deleteTasks(id).unwrap();
            console.log("Xóa công việc thành công!");
        } catch (error) {
            console.error("Lỗi khi xóa:", error);
            console.log("Xóa thất bại!");
        }
    }

    // Tính toán số lượng
    const completedCount = data?.filter(item => item.isCompleted).length || 0;
    const totalCount = data?.length || 0;

    return (
        <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="w-[600px] min-h-[600px] bg-amber-200 rounded-2xl overflow-hidden shadow-2xl">
                {/* Form thêm công việc */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full p-6 bg-amber-500 flex flex-col gap-3"
                >
                    <h1 className="text-2xl font-bold text-white text-center mb-2">
                        📝 Todo List
                    </h1>
                    
                    {/* Progress Bar */}
                    {totalCount > 0 && (
                        <div className="bg-amber-400 rounded-full p-1">
                            <div className="flex items-center justify-between text-white text-sm mb-1 px-2">
                                <span className="font-semibold">Tiến độ</span>
                                <span className="font-semibold">{completedCount}/{totalCount}</span>
                            </div>
                            <div className="bg-white rounded-full h-3 overflow-hidden">
                                <div 
                                    className="bg-green-500 h-full transition-all duration-500 ease-out"
                                    style={{ width: `${(completedCount / totalCount) * 100}%` }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3">
                        <div className="flex-1 flex flex-col">
                            <input
                                {...register('title', {
                                    required: "Vui lòng nhập công việc"
                                })}
                                placeholder="Nhập công việc..."
                                type="text"
                                className="h-10 px-4 outline-none bg-white text-black border-2 border-amber-300 rounded-xl focus:border-amber-600 transition-colors"
                            />
                            {errors.title && (
                                <span className="text-red-100 text-sm mt-1 ml-1 font-medium">
                                    ⚠️ {errors.title.message}
                                </span>
                            )}
                        </div>
                        <Button
                            type="submit"
                            disabled={isCreating}
                            className="!bg-purple-600 hover:!bg-purple-700 !rounded-xl !px-6 !font-semibold disabled:opacity-50"
                        >
                            {isCreating ? "Đang thêm..." : "➕ Thêm"}
                        </Button>
                    </div>
                </form>

                {/* Danh sách công việc */}
                <div className="p-6 max-h-[500px] overflow-y-auto">
                    {isLoading ? (
                        // Loading state
                        <div className="flex flex-col items-center justify-center py-20">
                            <svg className="w-12 h-12 animate-spin text-amber-600" viewBox="0 0 100 101" fill="none">
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor"
                                />
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentFill"
                                />
                            </svg>
                            <p className="mt-4 text-gray-600 font-medium">Đang tải dữ liệu...</p>
                        </div>
                    ) : !data || data.length === 0 ? (
                        // Empty state
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">📋</div>
                            <p className="text-gray-600 font-medium">
                                Chưa có công việc nào
                            </p>
                            <p className="text-gray-500 text-sm mt-2">
                                Hãy thêm công việc mới!
                            </p>
                        </div>
                    ) : (
                        // List items
                        <ul className="space-y-3">
                            {data.map((item) => (
                                <li
                                    key={item.id}
                                    className={`p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 ${
                                        item.isCompleted 
                                            ? 'bg-green-50 border-2 border-green-300' 
                                            : 'bg-white'
                                    }`}
                                >
                                    {editingTaskId === item.id ? (
                                        // Form edit inline
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="text"
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                                className="flex-1 h-10 px-3 border-2 border-blue-400 rounded-lg outline-none focus:border-blue-600 transition-colors"
                                                autoFocus
                                                placeholder="Nhập tiêu đề mới..."
                                            />
                                            <Button
                                                className="!bg-green-500 hover:!bg-green-600 !rounded-lg !px-4 !py-2"
                                                onClick={() => handleSaveEdit(item.id)}
                                                disabled={isUpdating}
                                            >
                                                {isUpdating ? "💾 Đang lưu..." : "💾 Lưu"}
                                            </Button>
                                            <Button
                                                className="!bg-gray-500 hover:!bg-gray-600 !rounded-lg !px-4 !py-2"
                                                onClick={handleCancelEdit}
                                                disabled={isUpdating}
                                            >
                                                ❌ Hủy
                                            </Button>
                                        </div>
                                    ) : (
                                        // Hiển thị bình thường
                                        <div className="flex items-center gap-3">
                                            {/* Checkbox */}
                                            <button
                                                onClick={() => handleToggleComplete(item)}
                                                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                                    item.isCompleted
                                                        ? 'bg-green-500 border-green-500'
                                                        : 'border-gray-400 hover:border-green-500'
                                                }`}
                                            >
                                                {item.isCompleted && (
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </button>

                                            <span className={`flex-1 font-medium ${
                                                item.isCompleted 
                                                    ? 'line-through text-gray-500' 
                                                    : 'text-gray-800'
                                            }`}>
                                                <span className="inline-block w-6 h-6 bg-amber-400 text-white rounded-full text-center text-sm leading-6 mr-2">
                                                    {item.id}
                                                </span>
                                                {item.title}
                                            </span>
                                            
                                            <Button
                                                className="!bg-blue-500 hover:!bg-blue-600 !rounded-lg !px-4 !py-2"
                                                onClick={() => handleEdit(item)}
                                            >
                                                ✏️ Sửa
                                            </Button>
                                            <Button
                                                className="!bg-red-500 hover:!bg-red-600 !rounded-lg !px-4 !py-2"
                                                onClick={() => handleDelete(item.id)}
                                                disabled={isDeleting}
                                            >
                                                {isDeleting ? "🗑️ Đang xóa..." : "🗑️ Xóa"}
                                            </Button>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TodoList;