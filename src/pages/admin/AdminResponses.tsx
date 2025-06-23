import { useState } from 'react';
import { useGetResponsesQuery } from '../../features/api/apiSlice';

interface Response {
  id: string;
  user: {
    name: string;
    phone: string;
    email: string;
  };
  question: {
    text: string;
  };
  answer: string;
  submittedAt: string;
}

function AdminResponses() {
  const { data: responses, isLoading, isError } = useGetResponsesQuery(undefined);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredResponses = responses?.filter((res: Response) => {
    const lowerTerm = searchTerm.toLowerCase();
    return (
      res.user.name.toLowerCase().includes(lowerTerm) ||
      res.user.email.toLowerCase().includes(lowerTerm) ||
      res.user.phone.toLowerCase().includes(lowerTerm) ||
      res.question.text.toLowerCase().includes(lowerTerm)
    );
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">User Responses</h1>

      <input
        type="text"
        placeholder="Search by name, email, phone or question"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 border rounded w-full mb-4"
      />

      {isLoading ? (
        <p>Loading responses...</p>
      ) : isError ? (
        <p className="text-red-600">Failed to load responses</p>
      ) : (
        <table className="w-full border-collapse bg-white shadow">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Name</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Question</th>
              <th className="border p-2">Answer</th>
              <th className="border p-2">Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {filteredResponses?.map((res: Response) => (
              <tr key={res.id}>
                <td className="border p-2">{res.user.name}</td>
                <td className="border p-2">{res.user.phone}</td>
                <td className="border p-2">{res.user.email}</td>
                <td className="border p-2">{res.question.text}</td>
                <td className="border p-2">{res.answer}</td>
                <td className="border p-2">
                  {new Date(res.submittedAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminResponses;
