import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Доступ запрещен"
};

const ForbiddenPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-red-600 mb-4">403</h1>
                <h2 className="text-2xl font-semibold mb-4">Доступ запрещен</h2>
                <p className="text-gray-600 mb-8">
                    У вас нет прав для просмотра этого ресурса.
                </p>
                <a 
                    href="/" 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Вернуться на главную
                </a>
            </div>
        </div>
    );
};

export default ForbiddenPage;
