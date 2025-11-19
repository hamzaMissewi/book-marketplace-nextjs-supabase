"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function TestConnection() {
  const [connectionStatus, setConnectionStatus] = useState({
    loading: true,
    error: null as string | null,
    data: null as any,
  });

  useEffect(() => {
    const testConnection = async () => {
      try {
        const supabase = createClient();

        // Test authentication
        const { data: authData, error: authError } =
          await supabase.auth.getSession();

        if (authError) throw authError;

        // Test a simple query (adjust the table name to one that exists in your DB)
        const { data, error } = await supabase
          .from("profiles") // Change 'profiles' to your table name
          .select("*")
          .limit(1);

        if (error) throw error;

        setConnectionStatus({
          loading: false,
          error: null,
          data: {
            session: authData.session,
            tableData: data,
            env: {
              supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
              nodeEnv: process.env.NODE_ENV,
            },
          },
        });
      } catch (error: any) {
        console.error("Connection test failed:", error);
        setConnectionStatus({
          loading: false,
          error: error.message,
          data: null,
        });
      }
    };

    testConnection();
  }, []);

  if (connectionStatus.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Testing Supabase connection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Supabase Connection Test</h1>

        {connectionStatus.error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Connection Failed
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{connectionStatus.error}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Connection Successful!
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Successfully connected to Supabase.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              Environment Variables
            </h2>
            <div className="bg-gray-50 p-4 rounded-md overflow-x-auto">
              <pre className="text-sm">
                NEXT_PUBLIC_SUPABASE_URL = "
                {process.env.NEXT_PUBLIC_SUPABASE_URL}" NODE_ENV = "
                {process.env.NODE_ENV}"
              </pre>
            </div>
          </div>

          {connectionStatus.data?.session && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Session Info
              </h2>
              <div className="bg-gray-50 p-4 rounded-md overflow-x-auto">
                <pre className="text-sm">
                  {JSON.stringify(connectionStatus.data.session, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {connectionStatus.data?.tableData && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Sample Data
              </h2>
              <div className="bg-gray-50 p-4 rounded-md overflow-x-auto">
                <pre className="text-sm">
                  {JSON.stringify(connectionStatus.data.tableData, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Test Again
          </button>
        </div>
      </div>
    </div>
  );
}
