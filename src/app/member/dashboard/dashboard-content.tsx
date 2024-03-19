"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { pnd } from "@prisma/client";
import Link from "next/link";
import GeneratePdf from "./generate-pdf";
import { AiFillFilePdf } from "react-icons/ai";
import { MdLogout } from "react-icons/md";
import Image from "next/image";
import { logout } from "./action";

export default function DashboardData(userData: {
  mType: number;
  mcode: string;
}) {
  const [data, setData] = useState<pnd[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [mcode, setMcode] = useState(userData.mcode);

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVICE_URL}:${process.env.NEXT_PUBLIC_SERVICE_PORT}/member/api/dashboard`,
        {
          params: { page: page, limit: limit, mcode: mcode },
        }
      )
      .then((response) => {
        setData(response.data.pnd);
        setPageCount(response.data.pageCount);
        setCount(response.data.count);
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

  const onClick = async () => {
    await logout();
    return false;
  };

  return (
    <div className="p-14 mx-2">
      {/* header */}
      <div className="mb-4 justify-between items-start flex-row flex">
        <p className="md:text-2xl font-bold">รายการข้อมูลกำกับภาษี</p>
        <div onClick={onClick} className="flex cursor-pointer gap-2">
          <p className="text-[#D03232] md:text-base">ออกจากระบบ</p>
          <MdLogout className="w-5 h-5 text-[#D03232]" />
        </div>
      </div>

      {/* table */}
      <div className="flex justify-center items-center">
        <div className="flex flex-col bg-white overflow-hidden">
          <div className="overflow-x-auto overflow-hidden">
            <table className="w-full min-w-[1024px] table-fixed divide-y divide-ctLightGray border-b border-b-ctLightGray">
              <thead className="text-base bg-[#CDD8FF]">
                <tr>
                  <th className="px-5 py-4 text-left text-sm w-[112px] min-w-[112px]">
                    ภงด.
                  </th>
                  <th className="px-5 py-4 text-left text-sm w-[160px] min-w-[160px]">
                    ชื่อ
                  </th>
                  <th className="px-5 py-4 text-left text-sm w-[160px] min-w-[160px]">
                    ที่อยู่
                  </th>
                  <th className="px-5 py-4 text-left text-sm w-[132px] min-w-[132px]">
                    เลขบัตรประชาชน
                  </th>
                  <th className="px-5 py-4 text-left text-sm w-[92px] min-w-[92px]">
                    วันที่จ่าย
                  </th>
                  <th className="px-5 py-4 text-left text-sm w-[91px] min-w-[91px]">
                    ประเภทรายได้
                  </th>
                  <th className="px-5 py-4 text-left text-sm w-[79px] min-w-[79px]">
                    อัตราร้อยละ
                  </th>
                  <th className="px-5 py-4 text-left text-sm w-[79px] min-w-[85px]">
                    จำนวนเงินได้
                  </th>
                  <th className="px-5 py-4 text-left text-sm w-[108px] min-w-[108px]">
                    ภาษีหัก ณ ที่จ่าย
                  </th>
                  <th className="px-5 py-4 text-left text-sm w-[55px] min-w-[55px]"></th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.map((item: pnd) => (
                    <tr
                      key={item.id}
                      className="bg-white border-b dark:border-[#D9D9D9]"
                    >
                      <td className="px-5 py-4 text-left text-sm">
                        {item?.docno}
                      </td>
                      <td className="px-5 py-4 text-left text-sm">
                        {item?.name}
                      </td>
                      <td className="px-5 py-4 text-left text-sm">
                        {item?.address}
                      </td>
                      <td className="px-5 py-4 text-left text-sm">
                        {item?.idcardno}
                      </td>
                      <td className="px-5 py-4 text-left text-sm">
                        {item?.datepaid}
                      </td>
                      <td className="px-5 py-4 text-left text-sm">
                        {item?.incometype}
                      </td>
                      <td className="px-5 py-4 text-left text-sm">
                        {item?.percentage}
                      </td>
                      <td className="px-5 py-4 text-left text-sm">
                        {String(item?.income)}
                      </td>
                      <td className="px-5 py-4 text-left text-sm">
                        {String(item?.wht)}
                      </td>
                      <td className="px-5 py-4 text-left text-sm">
                        <button
                          type="button"
                          onClick={() => {
                            GeneratePdf(item, userData.mType);
                          }}
                        >
                          <AiFillFilePdf className="h-6 w-6 text-[#D03232]" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* footer */}
      <div>
        {isPageOutOfRange ? (
          <div>
            <div className="flex justify-center items-center mt-8">
              <Image
                width={240}
                height={240}
                src={"/data-not-found.png"}
                alt="Picture of the author"
              />
            </div>

            <div className="flex justify-center items-center">
              <p className="text-center md:text-2xl font-bold mt-8">
                ไม่มีข้อมูลกำกับภาษี
              </p>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center border-light-gray p-4 bg-white border-b dark:border-[#D9D9D9] w-full">
            <p className="text-sm">
              showing {data.length} to {limit} of {count} results
            </p>
            <div className="flex gap-4">
              {page === 1 ? (
                <div className="opacity-60 text-sm cursor-not-allowed" aria-disabled="true">
                  Previous
                </div>
              ) : (
                <Link
                  href={`?page=${prevPage}`}
                  aria-label="Previous Page"
                  onClick={() => {
                    setPage(prevPage);
                  }}
                  className="text-sm"
                >
                  Previous
                </Link>
              )}
              {pageNumbers.map((pageNumber, index) => (
                <Link
                  key={index}
                  className={
                    page === pageNumber
                      ? "bg-[#002DCD] fw-bold px-2 rounded-md text-white text-sm"
                      : "hover:bg-gray-300 px-1 rounded-md text-sm"
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
                <div className="opacity-60 text-sm cursor-not-allowed" aria-disabled="true">
                  Next
                </div>
              ) : (
                <Link
                  href={`?page=${nextPage}`}
                  aria-label="Next Page"
                  onClick={() => {
                    setPage(nextPage);
                  }}
                  className="text-sm"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
