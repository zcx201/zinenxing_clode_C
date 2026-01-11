import PyPDF2

try:
    with open('股票数据-沪深股市API.pdf', 'rb') as pdf_file:
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        text = ''
        for page in pdf_reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + '\n\n'
        
        print("PDF文本提取成功！")
        print("\n" + "="*50 + "\n")
        print("前5000字符内容：")
        print("\n" + "="*50 + "\n")
        print(text[:5000])
        
        # 保存完整文本到文件，方便后续查看
        with open('pdf_content.txt', 'w', encoding='utf-8') as output_file:
            output_file.write(text)
        print("\n" + "="*50 + "\n")
        print("完整内容已保存到pdf_content.txt文件")
except Exception as e:
    print(f"提取失败：{e}")
    import traceback
    traceback.print_exc()
