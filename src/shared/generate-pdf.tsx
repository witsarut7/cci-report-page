"use client";

import { ThaiBaht } from "thai-baht-text-ts";
import { pnd } from "@prisma/client";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { TDocumentDefinitions } from "pdfmake/interfaces";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

pdfMake.fonts = {
  THSarabunNew: {
    normal: "https://codingthailand.com/site/fonts/th/THSarabunNew.ttf",
    bold: "https://codingthailand.com/site/fonts/th/THSarabunNewBold.ttf",
    italics: "https://codingthailand.com/site/fonts/th/THSarabunNewItalic.ttf",
  },
  // Roboto: {
  //   normal:
  //     "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf",
  //   bold: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf",
  //   italics:
  //     "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf",
  //   bolditalics:
  //     "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf",
  // },
};

const NumZeroFormat = (price: any) =>
  `${Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
  }).format(price)}`;

export default function GeneratePdf(
  data: pnd,
  mType: number,
  generateType: string
) {
  const docDefinition: TDocumentDefinitions = {
    info: {
      title: `${data.docno}-${data.name}.pdf`,
    },
    content: [
      {
        columns: [
          {
            width: "*",
            text: "หนังสือรับรองการหักภาษี ณ ที่จ่าย ตามมาตรา 50 ทวิ แห่งประมวลรัษฎากร",
            fontSize: 11,
            margin: [0, 0, 0, 7],
          },
          {
            width: 155,
            canvas: [
              {
                type: "line",
                x1: 55,
                y1: 15,
                x2: 150,
                y2: 15,
                lineWidth: -1,
                dash: { length: 1 },
              },
            ],
          },
          {
            width: 108,
            text: "ลำดับที่",
            fontSize: 11,
            margin: [0, 0, 0, 7],
          },
        ],
      },
      {
        text: `${data?.docno}`,
        absolutePosition: { x: 495, y: 0.8 },
        fontSize: 16,
        bold: true,
      },
      {
        table: {
          widths: ["*", 100],
          body: [
            [
              {
                border: [true, true, false, false],
                text: "ผู้มีหน้าที่หักภาษี ณ ที่จ่าย :",
                fontSize: 11,
                decoration: "underline",
                decorationStyle: "solid",
                decorationColor: "black",
              },
              {
                border: [false, true, true, false],
                text: "เลขที่ประจำตัวผู้เสียภาษีอากร",
                fontSize: 11,
                alignment: "right",
              },
            ],
          ],
        },
      },
      {
        table: {
          widths: ["*", 60, 10],
          body: [
            [
              {
                border: [true, false, false, false],
                text: [
                  "ชื่อ\t",
                  {
                    text: "บริษัท ซีซีไอ อินเตอร์เนชั่นแนล จำกัด",
                    fontSize: 16,
                    bold: true,
                  },
                ],
                margin: [15, 0, 0, 0],
                fontSize: 11,
              },
              {
                border: [true, true, true, false],
                text: "0105559080089",
                fontSize: 12,
                alignment: "center",
                bold: true,
                margin: [0, 3, 0, 0],
              },
              {
                border: [false, false, true, false],
                text: "",
              },
            ],
          ],
        },
      },
      {
        table: {
          widths: [30, "*"],
          body: [
            [
              {
                border: [true, false, false, false],
                text: "ที่อยู่",
                margin: [10, 5, 0, 0],
                fontSize: 11,
              },
              {
                border: [true, true, true, true],
                text: "275 อาคารโพธิ์วิจิตร ซ.คุณย่าเหลียง ถ.วิภาวดีรังสิต แขวงสนามบิน เขตดอนเมือง กทม 10210",
                fontSize: 15,
                alignment: "left",
                bold: true,
              },
            ],
            [
              {
                border: [true, false, true, false],
                text: "",
                colSpan: 2,
              },
            ],
          ],
        },
      },
      {
        table: {
          widths: ["*", 200],
          body: [
            [
              {
                border: [true, true, false, false],
                text: "ผู้ถูกหักภาษี ณ ที่จ่าย :",
                fontSize: 11,
                decoration: "underline",
                decorationStyle: "solid",
                decorationColor: "black",
              },
              {
                border: [false, true, true, false],
                text: "เลขที่ประจำตัวประชาชน / เลขที่ประจำตัวผู้เสียภาษีอากร",
                fontSize: 11,
                alignment: "right",
              },
            ],
          ],
        },
      },
      {
        table: {
          widths: ["*", 60, 10],
          body: [
            [
              {
                border: [true, false, false, false],
                text: [
                  "ชื่อ\t",
                  {
                    text: `${data?.name}`,
                    fontSize: 16,
                    bold: true,
                  },
                ],
                margin: [15, 0, 0, 0],
                fontSize: 11,
              },
              {
                border: [true, true, true, true],
                text: `${data?.idcardno}`,
                fontSize: 12,
                alignment: "center",
                bold: true,
                margin: [0, 3, 0, 0],
              },
              {
                border: [false, false, true, false],
                text: "",
              },
            ],
          ],
        },
      },
      {
        canvas: [
          {
            type: "line",
            x1: 31,
            y1: -5,
            x2: 300,
            y2: -5,
            lineWidth: -1,
            dash: { length: 1 },
          },
        ],
      },
      {
        table: {
          widths: ["*"],
          body: [
            [
              {
                border: [true, false, true, false],
                text: [
                  "ที่อยู่\t",
                  {
                    text: `${data?.address}`,
                    fontSize: 11,
                    bold: true,
                  },
                ],
                margin: [10, 0, 0, 0],
                fontSize: 11,
              },
            ],
          ],
        },
      },
      {
        canvas: [
          {
            type: "line",
            x1: 31,
            y1: -5,
            x2: 470,
            y2: -5,
            lineWidth: -1,
            dash: { length: 1 },
          },
        ],
      },
      {
        table: {
          widths: ["*", 80, 80, 80, 80],
          body: [
            [
              {
                border: [true, true, false, false],
                text: "ลำดับที่\t\t\t\t\t\tในแบบ",
                margin: [10, 15, 0, 0],
                fontSize: 11,
              },
              {
                border: [false, true, false, false],
                text: [
                  "(1) ภ.ง.ด. 1ก\n",
                  {
                    text: "(5) ภ.ง.ด. 2ก",
                    fontSize: 11,
                    bold: true,
                  },
                ],
                fontSize: 11,
                margin: [15, 0, 0, 0],
                bold: true,
              },
              {
                border: [false, true, false, false],
                text: [
                  "(2) ภ.ง.ด. 1ก พิเศษ\n",
                  {
                    text: "(6) ภ.ง.ด. 3ก",
                    fontSize: 11,
                    bold: true,
                  },
                ],
                fontSize: 11,
                margin: [15, 0, 0, 0],
                bold: true,
              },
              {
                border: [false, true, false, false],
                text: [
                  "(3) ภ.ง.ด. 2\n",
                  {
                    text: "(7) ภ.ง.ด. 53",
                    fontSize: 11,
                    bold: true,
                  },
                ],
                fontSize: 11,
                margin: [15, 0, 0, 0],
                bold: true,
              },
              {
                border: [false, true, true, false],
                text: "(4) ภ.ง.ด. 3\n",
                fontSize: 11,
                margin: [15, 0, 0, 0],
                bold: true,
              },
            ],
          ],
        },
      },
      // box
      {
        canvas: [
          {
            type: "polyline",
            lineWidth: 1,
            closePath: true,
            points: [
              { x: 39, y: -4 },
              { x: 39, y: -24 },
              { x: 90, y: -24 },
              { x: 90, y: -4 },
            ],
          },
        ],
      },
      // checkbox (1), (5)
      {
        image: "unchecked",
        height: 7,
        width: 7,
        absolutePosition: { x: 228, y: 177.5 },
      },
      {
        image: "unchecked",
        height: 7,
        width: 7,
        absolutePosition: { x: 228, y: 191.9 },
      },
      // checkbox (2), (6)
      {
        image: "unchecked",
        height: 7,
        width: 7,
        absolutePosition: { x: 317, y: 177.5 },
      },
      {
        image: "unchecked",
        height: 7,
        width: 7,
        absolutePosition: { x: 317, y: 191.9 },
      },
      // checkbox (3), (7)
      {
        image: "unchecked",
        height: 7,
        width: 7,
        absolutePosition: { x: 406, y: 177.5 },
      },
      mType === 1
        ? {
            image: "checked",
            height: 7,
            width: 7,
            absolutePosition: { x: 406, y: 191.9 },
          }
        : {
            image: "unchecked",
            height: 7,
            width: 7,
            absolutePosition: { x: 406, y: 191.9 },
          },
      // checkbox (4)
      mType !== 1
        ? {
            image: "checked",
            height: 7,
            width: 7,
            absolutePosition: { x: 495, y: 177.5 },
          }
        : {
            image: "unchecked",
            height: 7,
            width: 7,
            absolutePosition: { x: 495, y: 177.5 },
          },
      {
        table: {
          widths: ["*", 55, 75, 75],
          body: [
            [
              {
                text: "ประเภทเงินได้พึงประเมินที่จ่าย",
                alignment: "center",
                fontSize: 11,
                margin: [0, 8, 0, 0],
                bold: true,
              },
              {
                text: "วัน เดือน หรือ ปีภาษีที่จ่าย",
                alignment: "center",
                fontSize: 11,
                bold: true,
              },
              {
                text: "จำนวนเงินที่จ่าย",
                alignment: "center",
                fontSize: 11,
                margin: [0, 8, 0, 0],
                bold: true,
              },
              {
                text: "ภาษีที่หัก \nและนำส่งไว้",
                alignment: "center",
                fontSize: 11,
                bold: true,
              },
            ],
            [
              {
                border: [true, false, false, false],
                text: "1. เงินเดือน ค่าจ้าง เบี้ยเลี้ยง โบนัส ฯลฯ ตามมาตรา 40 (1)",
                alignment: "left",
                fontSize: 11,
                margin: [30, 7, 0, 0],
              },
              {
                border: [true, false, false, false],
                text: "",
                alignment: "center",
                fontSize: 11,
                margin: [0, 7, 0, 0],
              },
              {
                border: [true, false, false, false],
                text: "",
                alignment: "right",
                fontSize: 11,
                margin: [0, 7, 0, 0],
              },
              {
                border: [true, false, true, false],
                text: "",
                alignment: "right",
                fontSize: 11,
                margin: [0, 7, 0, 0],
              },
            ],
            [
              {
                border: [true, false, false, false],
                text: [
                  "2. ค่าธรรมเนียม ",
                  data.incometype === "ค่านายหน้า"
                    ? {
                        text: "ค่านายหน้า",
                        fontSize: 11,
                        bold: true,
                        decoration: "underline",
                        decorationStyle: "solid",
                        decorationColor: "black",
                      }
                    : {
                        text: "ค่านายหน้า",
                        fontSize: 11,
                      },
                  ,
                  {
                    text: " ที่ปรึกษา ฯลฯ ตามมาตรา 40 (2)",
                    fontSize: 11,
                  },
                ],
                alignment: "left",
                fontSize: 11,
                margin: [30, 0, 0, 0],
              },
              data.incometype === "ค่านายหน้า"
                ? {
                    border: [true, false, false, false],
                    text: `${data?.datepaid}`,
                    alignment: "center",
                    fontSize: 11,
                  }
                : {
                    border: [true, false, false, false],
                    text: "",
                    alignment: "center",
                    fontSize: 11,
                  },
              data.incometype === "ค่านายหน้า"
                ? {
                    border: [true, false, false, false],
                    text: `${NumZeroFormat(data?.income)}`,
                    alignment: "right",
                    fontSize: 11,
                  }
                : {
                    border: [true, false, false, false],
                    text: "",
                    alignment: "right",
                    fontSize: 11,
                  },
              data.incometype === "ค่านายหน้า"
                ? {
                    border: [true, false, true, false],
                    text: `${NumZeroFormat(data?.wht)}`,
                    alignment: "right",
                    fontSize: 11,
                  }
                : {
                    border: [true, false, true, false],
                    text: "",
                    alignment: "right",
                    fontSize: 11,
                  },
            ],
            [
              {
                border: [true, false, false, false],
                text: "3. ค่าแห่งลิขสิทธิ์ ฯลฯ ตามมาตรา 40 (3)",
                alignment: "left",
                fontSize: 11,
                margin: [30, 0, 0, 0],
              },
              {
                border: [true, false, false, false],
                text: "",
                alignment: "center",
                fontSize: 11,
              },
              {
                border: [true, false, false, false],
                text: "",
                alignment: "right",
                fontSize: 11,
              },
              {
                border: [true, false, true, false],
                text: "",
                alignment: "right",
                fontSize: 11,
              },
            ],
            [
              {
                border: [true, false, false, false],
                text: "4. (ก) ค่าดอกเบี้ย ฯลฯ ตามมาตรา 40 (4) (ก)",
                alignment: "left",
                fontSize: 11,
                margin: [30, 0, 0, 0],
              },
              {
                border: [true, false, false, false],
                text: "",
                alignment: "center",
                fontSize: 11,
              },
              {
                border: [true, false, false, false],
                text: "",
                alignment: "right",
                fontSize: 11,
              },
              {
                border: [true, false, true, false],
                text: "",
                alignment: "right",
                fontSize: 11,
              },
            ],
            [
              {
                border: [true, false, false, false],
                text: "(ข) เงินปันผล เงินส่วนแบ่งของกำไร ฯลฯ ตามมาตรา 40 (4) (ข) ที่จ่ายจาก",
                alignment: "left",
                fontSize: 11,
                margin: [38.3, 0, 0, 0],
              },
              {
                border: [true, false, false, false],
                text: "",
                alignment: "center",
                fontSize: 11,
              },
              {
                border: [true, false, false, false],
                text: "",
                alignment: "right",
                fontSize: 11,
              },
              {
                border: [true, false, true, false],
                text: "",
                alignment: "right",
                fontSize: 11,
              },
            ],
            [
              {
                border: [true, false, false, false],
                text: "(1) กิจการที่ต้องเสียภาษีเงินได้นิติบุคคลในอัตราดังนี้",
                alignment: "left",
                fontSize: 11,
                margin: [38.3, 0, 0, 0],
              },
              {
                border: [true, false, false, false],
                text: "",
                alignment: "center",
                fontSize: 11,
              },
              {
                border: [true, false, false, false],
                text: "",
                alignment: "right",
                fontSize: 11,
              },
              {
                border: [true, false, true, false],
                text: "",
                alignment: "right",
                fontSize: 11,
              },
            ],
            [
              {
                border: [true, false, false, false],
                text: "(1.1) อัตราร้อยละ 30",
                alignment: "left",
                fontSize: 11,
                margin: [50, 0, 0, 0],
              },
              {
                border: [true, false, false, false],
                text: "",
                alignment: "center",
                fontSize: 11,
              },
              {
                border: [true, false, false, false],
                text: "",
                alignment: "right",
                fontSize: 11,
              },
              {
                border: [true, false, true, false],
                text: "",
                alignment: "right",
                fontSize: 11,
              },
            ],
            [
              {
                border: [true, false, false, false],
                text: "(1.2) อัตราร้อยละ 25",
                alignment: "left",
                fontSize: 11,
                margin: [50, 0, 0, 0],
              },
              {
                border: [true, false, false, false],
                text: "",
                alignment: "center",
                fontSize: 11,
              },
              {
                border: [true, false, false, false],
                text: "",
                alignment: "right",
                fontSize: 11,
              },
              {
                border: [true, false, true, false],
                text: "",
                alignment: "right",
                fontSize: 11,
              },
            ],
            [
              {
                border: [true, false, false, false],
                text: "(1.3) อัตราร้อยละ 20",
                alignment: "left",
                fontSize: 11,
                margin: [50, 0, 0, 0],
              },
              {
                border: [true, false, false, false],
                text: "",
                alignment: "center",
                fontSize: 11,
              },
              {
                border: [true, false, false, false],
                text: "",
                alignment: "right",
                fontSize: 11,
              },
              {
                border: [true, false, true, false],
                text: "",
                alignment: "right",
                fontSize: 11,
              },
            ],
            [
              {
                border: [true, false, false, false],
                text: "(1.4) อัตราอื่น ๆ (ระบุ)...............",
                alignment: "left",
                fontSize: 11,
                margin: [50, 0, 0, 0],
              },
              {
                border: [true, false, false, false],
                text: "",
                alignment: "center",
                fontSize: 11,
              },
              {
                border: [true, false, false, false],
                text: "",
                alignment: "right",
                fontSize: 11,
              },
              {
                border: [true, false, true, false],
                text: "",
                alignment: "right",
                fontSize: 11,
              },
            ],
            [
              {
                border: [true, false, false, false],
                text: "(2) กิจการที่ได้รับการยกเว้นภาษีเงินได้นิติบุลคล ซึ่งผู้รับเงินปันผลไม่ได้รับเครดิต",
                alignment: "left",
                fontSize: 11,
                margin: [38.3, 0, 0, 0],
              },
              {
                border: [true, false, false, false],
                text: "",
                alignment: "center",
                fontSize: 11,
              },
              {
                border: [true, false, false, false],
                text: "",
                alignment: "right",
                fontSize: 11,
              },
              {
                border: [true, false, true, false],
                text: "",
                alignment: "right",
                fontSize: 11,
              },
            ],
            [
              {
                border: [true, false, false, false],
                text: "(3) กำไรเฉพาะส่วนที่ได้รับยกเว้นไม่ต้องนำมารวมคำนวณภาษีเงินได้นิติบุคคล ซึ่งผู้รับเงินปันผลไม่ได้รับเครดิตภาษี",
                alignment: "left",
                fontSize: 11,
                margin: [38.3, 0, 0, 0],
              },
              {
                border: [true, false, false, false],
                text: "",
                alignment: "center",
                fontSize: 11,
              },
              {
                border: [true, false, false, false],
                text: "",
                alignment: "right",
                fontSize: 11,
              },
              {
                border: [true, false, true, false],
                text: "",
                alignment: "right",
                fontSize: 11,
              },
            ],
            [
              {
                border: [true, false, false, false],
                text: [
                  "5. การจ่ายเงินได้ที่ต้องหักภาษี ณ ที่จ่ายตามคำสั่งกรมสรรพากร ที่ออกตามมาตรา 3 เตรส เช่น ",
                  data.incometype === "รางวัล"
                    ? {
                        text: "รางวัล",
                        fontSize: 11,
                        bold: true,
                        decoration: "underline",
                        decorationStyle: "solid",
                        decorationColor: "black",
                      }
                    : {
                        text: "รางวัล",
                        fontSize: 11,
                      },
                  {
                    text: " ส่วนลดหรือประโยชน์ใด ๆ เนื่องจาก ",
                    fontSize: 11,
                  },
                  data.incometype === "ส่งเสริมการขาย"
                    ? {
                        text: "การส่งเสริมการขาย",
                        fontSize: 11,
                        bold: true,
                        decoration: "underline",
                        decorationStyle: "solid",
                        decorationColor: "black",
                      }
                    : {
                        text: "การส่งเสริมการขาย",
                        fontSize: 11,
                      },
                  {
                    text: "รางวัลในการประกวด การแข่งขัน การชิงโชค ค่าแสดงของนักแสดงสาธารณะ ค่าจ้างทำของ ค่าโฆษณา ค่าเช่า ค่าขนส่ง ค่าบริการ ค่าเบี้ยประกันวินาศภัย ฯลฯ",
                    fontSize: 11,
                  },
                ],
                alignment: "left",
                fontSize: 11,
                margin: [30, 0, 0, 0],
              },
              data.incometype === "รางวัล" ||
              data.incometype === "ส่งเสริมการขาย"
                ? {
                    border: [true, false, false, false],
                    text: `\n\n\n${data?.datepaid}`,
                    alignment: "center",
                    fontSize: 11,
                  }
                : {
                    border: [true, false, false, false],
                    text: "",
                    alignment: "center",
                    fontSize: 11,
                  },
              data.incometype === "รางวัล" ||
              data.incometype === "ส่งเสริมการขาย"
                ? {
                    border: [true, false, false, false],
                    text: `\n\n\n${NumZeroFormat(data?.income)}`,
                    alignment: "right",
                    fontSize: 11,
                  }
                : {
                    border: [true, false, false, false],
                    text: "",
                    alignment: "right",
                    fontSize: 11,
                  },
              data.incometype === "รางวัล" ||
              data.incometype === "ส่งเสริมการขาย"
                ? {
                    border: [true, false, true, false],
                    text: `\n\n\n${NumZeroFormat(data?.wht)}`,
                    alignment: "right",
                    fontSize: 11,
                  }
                : {
                    border: [true, false, true, false],
                    text: "",
                    alignment: "right",
                    fontSize: 11,
                  },
            ],
            [
              {
                border: [true, false, false, false],
                text: "6. อื่น ๆ (ระบุ).................................................................................",
                alignment: "left",
                fontSize: 11,
                margin: [30, 0, 0, 0],
              },
              {
                border: [true, false, false, false],
                text: "",
                alignment: "center",
                fontSize: 11,
              },
              {
                border: [true, false, false, false],
                text: "",
                alignment: "right",
                fontSize: 11,
              },
              {
                border: [true, false, true, false],
                text: "",
                alignment: "right",
                fontSize: 11,
              },
            ],
            [
              {
                border: [true, false, false, false],
                text: "7.",
                alignment: "left",
                fontSize: 11,
                margin: [30, 0, 0, 0],
              },
              {
                border: [true, false, false, false],
                text: "",
                alignment: "center",
                fontSize: 11,
              },
              {
                border: [true, false, false, false],
                text: "",
                alignment: "right",
                fontSize: 11,
              },
              {
                border: [true, false, true, false],
                text: "",
                alignment: "right",
                fontSize: 11,
              },
            ],
            [
              {
                border: [true, false, false, false],
                text: "รวมเงินที่จ่ายและภาษีที่หักนำส่ง",
                alignment: "left",
                fontSize: 11,
                margin: [220, 5, 0, 0],
                decoration: "underline",
                decorationStyle: "solid",
                decorationColor: "black",
              },
              {
                border: [false, true, false, false],
                text: "",
              },
              {
                border: [true, true, false, true],
                text: `${NumZeroFormat(data?.income)}`,
                alignment: "right",
                fontSize: 11,
                margin: [0, 4, 0, 0],
              },
              {
                border: [true, true, true, true],
                text: `${NumZeroFormat(data?.wht)}`,
                alignment: "right",
                fontSize: 11,
                margin: [0, 4, 0, 0],
              },
            ],
          ],
        },
      },
      // checkbox (1.1), (1.2), (1.3), (1.4)
      {
        image: "unchecked",
        height: 7,
        width: 7,
        absolutePosition: { x: 64, y: 369.4 },
      },
      {
        image: "unchecked",
        height: 7,
        width: 7,
        absolutePosition: { x: 64, y: 388.4 },
      },
      {
        image: "unchecked",
        height: 7,
        width: 7,
        absolutePosition: { x: 64, y: 408.4 },
      },
      {
        image: "unchecked",
        height: 7,
        width: 7,
        absolutePosition: { x: 64, y: 427.4 },
      },
      // checkbox (2), (3)
      {
        image: "unchecked",
        height: 7,
        width: 7,
        absolutePosition: { x: 52, y: 446.8 },
      },
      {
        image: "unchecked",
        height: 7,
        width: 7,
        absolutePosition: { x: 52, y: 465.8 },
      },
      {
        canvas: [
          {
            type: "line",
            x1: 44,
            y1: -29,
            x2: 220,
            y2: -29,
            lineWidth: -1,
            dash: { length: 1 },
          },
        ],
      },
      {
        table: {
          widths: ["*"],
          body: [
            [
              {
                border: [true, false, true, false],
                text: "",
              },
            ],
          ],
        },
      },
      {
        table: {
          widths: [180, "*"],
          body: [
            [
              {
                border: [true, false, true, false],
                text: "รวมเงินภาษีที่หักนำส่ง (ตัวอักษร)",
                alignment: "left",
                fontSize: 11,
                margin: [70, 5, 0, 0],
                decoration: "underline",
                decorationStyle: "solid",
                decorationColor: "black",
              },
              {
                border: [true, true, true, true],
                text: `${ThaiBaht(Number(data?.wht))}`,
                alignment: "center",
                fontSize: 15,
                bold: true,
              },
            ],
            [
              {
                border: [true, false, true, false],
                text: "เงินสะสมจ่ายเข้ากองทุนสำรองเลี้ยงชีพใบอนุญาต เลขที่....................................จำนวนเงิน........................................................บาท\nเงินสมทบเข้ากองทุนประกันสังคม จำนวนเงิน.....................................................บาท",
                alignment: "left",
                fontSize: 11,
                colSpan: 2,
                margin: [70, 3, 0, 0],
              },
            ],
            [
              {
                border: [true, false, true, false],
                text: "เลขที่บัญชีนายจ้าง\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tเลขที่บัตรประกันสังคม / เลขหมายบัตรประจำตัวประชาชน ของผู้ถูกหักภาษี ณ ที่จ่าย",
                alignment: "left",
                fontSize: 9,
                colSpan: 2,
                margin: [90, 0, 0, 0],
              },
            ],
            [
              {
                border: [true, false, true, false],
                text: "",
                margin: [0, 5, 0, 0],
                colSpan: 2,
              },
            ],
          ],
        },
      },
      // box
      {
        canvas: [
          {
            type: "polyline",
            lineWidth: 1,
            closePath: true,
            points: [
              { x: 434, y: -5 },
              { x: 434, y: -11 },
              { x: 447, y: -11 },
              { x: 447, y: -5 },
            ],
          },
          {
            type: "polyline",
            lineWidth: 1,
            closePath: true,
            points: [
              { x: 421, y: -5 },
              { x: 421, y: -11 },
              { x: 434, y: -11 },
              { x: 434, y: -5 },
            ],
          },
        ],
      },
      {
        table: {
          widths: [110, "*"],
          body: [
            [
              {
                border: [true, true, true, false],
                text: "ผู้จ่ายเงิน",
                fontSize: 13,
                margin: [8, 0, 0, 0],
              },
              {
                border: [true, true, true, false],
                text: "ขอรับรองว่า ข้อความและตัวเลขดังกล่าวข้างต้นถูกต้องตรงกับความจริงทุกประการ",
                fontSize: 13,
              },
            ],
            [
              {
                border: [true, false, true, false],
                text: "หักภาษี ณ ที่จ่าย",
                fontSize: 10,
                margin: [40, 0, 0, 0],
              },
              {
                border: [true, false, true, false],
                text: "",
              },
            ],
            [
              {
                border: [true, false, true, false],
                text: "ออกภาษีให้ตลอดไป",
                fontSize: 10,
                margin: [40, 0, 0, 0],
              },
              {
                border: [true, false, true, false],
                text: "",
              },
            ],
            [
              {
                border: [true, false, true, false],
                text: "ออกภาษีให้ครั้งเดียว",
                fontSize: 10,
                margin: [40, 0, 0, 0],
              },
              {
                border: [true, false, true, false],
                text: "(ลงชื่อ)\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tผู้มีหน้าที่หักภาษี ณ ที่จ่าย",
                fontSize: 11,
                margin: [20, 0, 0, 0],
              },
            ],
            [
              {
                border: [true, false, true, true],
                text: "อื่น ๆ ให้ระบุบ",
                fontSize: 10,
                margin: [40, 0, 0, 8],
              },
              {
                border: [true, false, true, true],
                text: `${data?.datepaid}`,
                alignment: "center",
                fontSize: 12,
                margin: [0, 0, 180, 0],
              },
            ],
          ],
        },
      },
      // checkbox
      {
        image: "checked",
        height: 7,
        width: 7,
        absolutePosition: { x: 55, y: 741.5 },
      },
      {
        image: "unchecked",
        height: 7,
        width: 7,
        absolutePosition: { x: 55, y: 759.8 },
      },
      {
        image: "unchecked",
        height: 7,
        width: 7,
        absolutePosition: { x: 55, y: 778.1 },
      },
      {
        image: "unchecked",
        height: 7,
        width: 7,
        absolutePosition: { x: 55, y: 796.9 },
      },
      {
        canvas: [
          {
            type: "line",
            x1: 165,
            y1: -30,
            x2: 335,
            y2: -30,
            lineWidth: -1,
            dash: { length: 1 },
          },
        ],
      },
      {
        canvas: [
          {
            type: "line",
            x1: 165,
            y1: -10,
            x2: 335,
            y2: -10,
            lineWidth: -1,
            dash: { length: 1 },
          },
        ],
      },
      {
        image: "cciSeal",
        height: 60,
        width: 95,
        absolutePosition: { x: 460, y: 740 },
      },
      {
        image: "signature",
        height: 27,
        width: 55,
        absolutePosition: { x: 235, y: 761 },
      },
    ],
    defaultStyle: {
      font: "THSarabunNew",
    },
    pageMargins: [20, 5, 20, 20],
    images: {
      checked:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAQAAACROWYpAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAF+2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTktMTItMzBUMDE6Mzc6MjArMDE6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE5LTEyLTMwVDAxOjM4OjI4KzAxOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE5LTEyLTMwVDAxOjM4OjI4KzAxOjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMSIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9IkRvdCBHYWluIDIwJSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowNzVjYjZmMy1jNGIxLTRiZjctYWMyOS03YzUxMWY5MWJjYzQiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo5ZTM1YTc3ZC0zNDM0LTI5NGQtYmEwOC1iY2I5MjYyMjBiOGIiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowYzc2MDY3Ny0xNDcwLTRlZDUtOGU4ZS1kNTdjODJlZDk1Y2UiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjBjNzYwNjc3LTE0NzAtNGVkNS04ZThlLWQ1N2M4MmVkOTVjZSIgc3RFdnQ6d2hlbj0iMjAxOS0xMi0zMFQwMTozNzoyMCswMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKE1hY2ludG9zaCkiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjA3NWNiNmYzLWM0YjEtNGJmNy1hYzI5LTdjNTExZjkxYmNjNCIgc3RFdnQ6d2hlbj0iMjAxOS0xMi0zMFQwMTozODoyOCswMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+jHsR7AAAAUNJREFUOMvN1T9Lw0AYx/EviLVFxFH8M3USgyAFoUsQ0UV8F6Ui4qCTbuJg34HgptBdUATrUoxiqYMgiOBoIcW9BVED+jgkntGm9i6CmN+Sg/vAcc89dwBd5Clzj6uZGg7LJAC62UFipEgKcmroaeZj/gpcIAhl5rE1M0cJQbiCOsIrs5h8WZ4R6j72yBrhcRo+dhE8bCOcoYng/hFOMxAXb/DAHTNxcCGo7JE5LqhjsW2KP6nDcGecCv1vRdC2eJQDLllooach2hbvIghvLJJgM0QHdeq8F0x/5ETRM4b0DonF7be+Pf+y4A4bZnETok4E/XG3xxR3WhasUWeLCg2OGYnXGP1MkPwnLRmJf3UN+RfgtBGe5MnHVQShxBQZzdgcIgjXsKSu/KZmXgKxBkmKsZ6bffoAelilQs3goauyTi+8A8mhgeQlxdNWAAAAAElFTkSuQmCC",
      unchecked:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAQAAACROWYpAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAF+2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTktMTItMzBUMDE6Mzc6MjArMDE6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE5LTEyLTMwVDAxOjM4OjU3KzAxOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE5LTEyLTMwVDAxOjM4OjU3KzAxOjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMSIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9IkRvdCBHYWluIDIwJSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpjMGUyMmJhZC1lY2VkLTQzZWUtYjIzZC1jNDZjOTNiM2UzNWMiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo5M2FhOTEzYy1hZDVmLWZmNGEtOWE5Ny1kMmUwZjdmYzFlYmUiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDozYmY2ODFlMy1hMTRhLTQyODMtOGIxNi0zNjQ4M2E2YmZlNjYiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjNiZjY4MWUzLWExNGEtNDI4My04YjE2LTM2NDgzYTZiZmU2NiIgc3RFdnQ6d2hlbj0iMjAxOS0xMi0zMFQwMTozNzoyMCswMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKE1hY2ludG9zaCkiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmMwZTIyYmFkLWVjZWQtNDNlZS1iMjNkLWM0NmM5M2IzZTM1YyIgc3RFdnQ6d2hlbj0iMjAxOS0xMi0zMFQwMTozODo1NyswMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+6AB6cQAAAPxJREFUOMvF1b1Kw1AYBuAnFf8QL8WlIHQJIriIdyEu4qCTXop7dwenTgUHpYvgJVhob8AuakE+h9hapJqcFDXvFDgPIXlzvgNLjnQ9GlRM340TK7DsUtRI2zqH09txxUzWn3IrhK4DecXs6wjhnqHwZk/K1fIiDAs81krCW54KPBDG8iTcNBIGf4ND1MWTdmrgqIOL5TM0S8SRhmMu1dAo+2DZ57t9eWajtKrvN1GVnrMK9HewhbBy+nPPJbTsJwmymOn8P7fkfLzQGCoG4G4S3vZc4J4QOnY0KyZ3LYQHjqcjf1Qxrx/inDXtWsfNlU1YdeZOP+Gg67mwwTvIDqR1iAowgQAAAABJRU5ErkJggg==",
      cciSeal:
        "data:image/jpeg;base64,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",
      signature:
        "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAApAFwDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9U6KKKACiiigAorM8T69beFfDmp6zeMUtbC2kuZWC7iFRSx479K8Ck+Jn7QVxYWGr6R4I8G+IPD9/aR3tveWGpXCTmORQ65glVMHaRwGPWgD6Qorzr4L/ABZHxQ0vVYb21h0zxHot19i1TTopGbyXKK6thlVgrA8ZHY8nGa7u41SztJVinu4IZG+6kkiqT9ATQBaorM13xRo3he3FxrOrWOkQEEiW+uUhXgZPLEDgVetbqC+tYrm2mjuLeZBJHNEwZHUjIZSOCCO4oAlooooAKKKKACvOP2ifiNf/AAn+DPibxVpkUT3un24aOS4Rnig3MFM0gUElIwxdsdlNej1DeWcGoWs1rdQx3NtMhjlhlUMjqRgqQeCCO1AHx74k/ZVm13xlbeOtXjPx10XUoopjaSaxLYjawyssUAl+xzRkEHYQnBzlq6PVv2Z734kfBnX9E1DTZNGu4LmWTwjY6jfM8ul2xWMi2kkhfHls6OAmWCowXOBgfTGi6LYeHNJtNL0qyg07TbSMQ29paxiOKJAMBVUcAD0FcHpvhvV9H+Puq6pDNqMnhzWNDQzRSTF7WK8hmCqUVmOxnjkOQoAPl5PNAHgU3wD+IE2h3Hh3wZodx8OPAjRxyaj4bk11PtOpOJVZ4ba9h3yW6FN6l2YlsqAFG41H4X/Yg0rUdY0u5k8HxeDrC1uTc3I1LWjr9zedMxFZ42RUbGC24kDO0AncPsqigDxX4b/sv+GvB/hG7statLPxJrd39pD6hcW+Vt4pXdlt7ZHZ/IhRXChEOOCeprT/AGWWuofgV4Z0y+haC70YT6K6Nn/l1nkt1P4rEp/GvV6ZHGkSkIioCSSFGOSck0APooooAKKKKACiiigAooooAKKKKACiiigAooooA//Z",
    },
  };

  if (generateType === "Download") {
    pdfMake.createPdf(docDefinition).download(`${data.docno}-${data.name}.pdf`);
  } else if (generateType === "Preview") {
    pdfMake.createPdf(docDefinition).open();
  }
}
