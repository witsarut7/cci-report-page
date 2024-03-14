"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { pnd } from "@prisma/client";
import Link from "next/link";
import GeneratePdf from "./generate-pdf";
import { FaFilePdf } from "react-icons/fa";
import { FcDeleteDatabase } from "react-icons/fc";

export default function DashboardData(userData: {
  mType: number;
  mcode: string;
}) {
  const [data, setData] = useState<pnd[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(100);
  const [mcode, setMcode] = useState(userData.mcode);

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVICE_URL}:${process.env.NEXT_PUBLIC_SERVICE_PORT}/api/dashboard`,
        {
          params: { page: page, limit: limit, mcode: mcode },
        }
      )
      .then((response) => {
        setData(response.data.pnd);
        setPageCount(response.data.pageCount);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [page, limit, mcode]);

  const prevPage = page - 1 > 0 ? page - 1 : 1;
  const nextPage = page + 1;
  const isPageOutOfRange = page > pageCount;

  const pageNumbers = [];
  const offsetNumber = 3;
  for (let i = page - offsetNumber; i <= page + offsetNumber; i++) {
    if (i >= 1 && i <= pageCount) {
      pageNumbers.push(i);
    }
  }

  return (
    <section className="container mx-auto p-6 font-mono">
      <div className="w-full mb-8 overflow-hidden rounded-lg shadow-lg">
        <div className="w-full overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-md font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase border-b border-gray-600">
                <th className="px-4 py-3 w-12 text-center min-w-[50px]">
                  ภงด.
                </th>
                <th className="px-4 py-3 w-12 text-center min-w-[190px]">
                  ชื่อ
                </th>
                <th className="px-4 py-3 w-12 text-center min-w-[200px]">
                  ที่อยู่
                </th>
                <th className="px-4 py-3 w-12 text-center min-w-[180px]">
                  เลขบัตร ปชช
                </th>
                <th className="px-4 py-3 w-12 text-center min-w-[130px]">
                  วันที่จ่าย
                </th>
                <th className="px-4 py-3 w-12 text-center min-w-[150px]">
                  ประเภทรายได้
                </th>
                <th className="px-4 py-3 w-12 text-center min-w-[100px]">
                  อัตราร้อยละ
                </th>
                <th className="px-4 py-3 w-12 text-center min-w-[150px]">
                  จำนวนเงินได้
                </th>
                <th className="px-4 py-3 w-12 text-center min-w-[150px]">
                  ภาษี หัก ณ ที่จ่าย
                </th>
                <th className="px-4 py-3 w-12 text-center min-w-[100px]"></th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {data &&
                data.map((item: pnd) => (
                  <tr key={item.id} className="text-gray-700">
                    <td className="px-4 py-3 text-sm text-center border">
                      {item?.docno}
                    </td>
                    <td className="px-4 py-3 text-sm text-left border">
                      {item?.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-left border">
                      {item?.address}
                    </td>
                    <td className="px-4 py-3 text-sm text-center border">
                      {item?.idcardno}
                    </td>
                    <td className="px-4 py-3 text-sm text-center border">
                      {item?.datepaid}
                    </td>
                    <td className="px-4 py-3 text-sm text-center border">
                      {item?.incometype}
                    </td>
                    <td className="px-4 py-3 text-sm text-center border">
                      {item?.percentage}
                    </td>
                    <td className="px-4 py-3 text-sm text-center border">
                      {String(item?.income)}
                    </td>
                    <td className="px-4 py-3 text-sm text-center border">
                      {String(item?.wht)}
                    </td>
                    <td className="px-4 py-3 text-sm text-center border">
                      <button
                        type="button"
                        onClick={() => {
                          GeneratePdf(item, userData.mType);
                        }}
                      >
                        <FaFilePdf className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        {isPageOutOfRange ? (
          <div>
            <FcDeleteDatabase className="mx-auto" size={300} />
            <p className="text-center text-lg">data not found</p>
          </div>
        ) : (
          <div className="flex justify-center items-center mt-16">
            <div className="flex border-[1px] gap-4 rounded-[10px] border-light-gray p-4">
              {page === 1 ? (
                <div className="opacity-60" aria-disabled="true">
                  Previous
                </div>
              ) : (
                <Link
                  href={`?page=${prevPage}`}
                  aria-label="Previous Page"
                  onClick={() => {
                    setPage(prevPage);
                  }}
                >
                  Previous
                </Link>
              )}
              {pageNumbers.map((pageNumber, index) => (
                <Link
                  key={index}
                  className={
                    page === pageNumber
                      ? "bg-gray-300 fw-bold px-2 rounded-md text-black"
                      : "hover:bg-gray-300 px-1 rounded-md"
                  }
                  href={`?page=${pageNumber}`}
                  onClick={() => {
                    setPage(pageNumber);
                  }}
                >
                  {pageNumber}
                </Link>
              ))}
              {page === pageCount ? (
                <div className="opacity-60" aria-disabled="true">
                  Next
                </div>
              ) : (
                <Link
                  href={`?page=${nextPage}`}
                  aria-label="Next Page"
                  onClick={() => {
                    setPage(nextPage);
                  }}
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
