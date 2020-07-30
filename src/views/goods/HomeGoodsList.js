import React, {
  Component,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { Table, Input, Button, Popconfirm, Form, Modal, message } from "antd";
import goodsAxios from "../../model/goods";
import "../../assets/css/goods/goodslist.css";
Date.prototype.format = function (str) {
  let year = this.getFullYear();
  let month = this.getMonth() + 1;
  let day = this.getDate();
  let hour = this.getHours();
  let minutes = this.getMinutes();
  let seconds = this.getSeconds();
  str = str
    .replace("yyyy", year)
    .replace("MM", month)
    .replace("dd", day)
    .replace("HH", hour)
    .replace("mm", minutes)
    .replace("ss", minutes);
  return str;
};
const EditableContext = React.createContext();
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef();
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async (e) => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};
export default class HomeGoodsList extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: "商品编号",
        dataIndex: "id",
        width: "8%",
      },
      {
        title: "商品名称",
        dataIndex: "goodsname",
        width: "30%",
        editable: true,
      },
      {
        title: "商品图片",
        dataIndex: "goodsimg",
        width: "16%",
      },
      {
        title: "商品价格",
        dataIndex: "goodsprice",
        editable: true,
      },
      {
        title: "商品数量",
        dataIndex: "goodsnum",
        editable: true,
      },
      {
        title: "折扣",
        dataIndex: "goodsdiscount",
        editable: true,
      },
      {
        title: "操作",
        dataIndex: "operation",
        render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm
              title="确认删除?"
              onConfirm={() => this.handleDelete(record.key)}
            >
              <Button>删除</Button>
            </Popconfirm>
          ) : null,
      },
    ];
    this.state = {
      dataSource: [],
      count: 2,
      visible: false,
    };
    goodsAxios.searchgoodslist().then((res) => {
      console.log(res.data);
      let dataSource = [];
      res.data.forEach((item, index) => {
        dataSource[index] = {};
        dataSource[index].key = index;
        dataSource[index].id = item.id;
        dataSource[index].goodsname = item.goodsname;
        dataSource[index].goodsprice = item.goodsprice;
        dataSource[index].goodsimg = (
          <img src={item.goodsimg} alt="goodslist" width="200" />
        );
        dataSource[index].goodsnum = item.goodsnum;
        dataSource[index].goodsdiscount = item.goodsdiscount;
      });
      this.setState({
        dataSource: dataSource,
        count: dataSource.length,
      });
    });
  }
  componentWillUnmount() {}
  handleDelete = (key) => {
    console.log(key);
    let deleteOne = this.state.dataSource.filter((item) => item.key === key);
    goodsAxios.deleteOnegoodslist(deleteOne[0].id).then((res) => {
      const dataSource = [...this.state.dataSource];
      this.setState({
        dataSource: dataSource.filter((item) => item.key !== key),
      });
      if (res.data.code !== 1) {
        message.warning(res.data.msg);
      } else {
        message.success(res.data.msg);
      }
    });
  };
  handleSave = (row) => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    this.setState({
      dataSource: newData,
    });
  };
  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = (e) => {
    const { count, dataSource } = this.state;
    let addgoodstimes = new Date().format("yyyy-MM-dd HH:mm:ss");
    goodsAxios
      .addgoodslist(
        this.refs.goodsname.value,
        this.refs.goodsprice.value,
        this.refs.goodsimg.value,
        this.refs.goodsnum.value,
        this.refs.goodsdiscount.value,
        200,
        addgoodstimes
      )
      .then((res) => {
        console.log(res.data);
        let newdata = res.data.newdata.pop();
        const newData = {
          key: count,
          id: newdata.id,
          goodsname: newdata.goodsname,
          goodsprice: newdata.goodsprice,
          goodsimg: <img src={newdata.goodsimg} alt="goodslist" width="200" />,
          goodsnum: newdata.goodsnum,
          goodsdiscount: newdata.goodsdiscount,
        };
        this.setState({
          dataSource: [...dataSource, newData],
          count: count + 1,
          visible: false,
        });
      });
  };

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };
  render() {
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }

      return {
        ...col,
        onCell: (record) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div>
        <Button
          onClick={this.showModal}
          type="primary"
          style={{
            marginBottom: 16,
          }}
        >
          添加商品
        </Button>
        <Modal
          title="添加商品"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p style={{ textAlign: "center" }}>
            <input
              type="text"
              placeholder="商品名称"
              ref="goodsname"
              style={{
                textIndent: "1em",
                width: "80%",
                height: "30px",
                display: "inline-block",
                border: "1px solid #333",
                borderRadius: "4px",
              }}
            />
          </p>
          <p style={{ textAlign: "center" }}>
            <input
              type="text"
              placeholder="商品图片地址"
              ref="goodsimg"
              style={{
                textIndent: "1em",
                width: "80%",
                height: "30px",
                display: "inline-block",
                border: "1px solid #333",
                borderRadius: "4px",
              }}
            />
          </p>
          <p style={{ textAlign: "center" }}>
            <input
              type="text"
              placeholder="商品价格"
              ref="goodsprice"
              style={{
                textIndent: "1em",
                width: "80%",
                height: "30px",
                display: "inline-block",
                border: "1px solid #333",
                borderRadius: "4px",
              }}
            />
          </p>
          <p style={{ textAlign: "center" }}>
            <input
              type="text"
              placeholder="商品数量"
              ref="goodsnum"
              style={{
                textIndent: "1em",
                width: "80%",
                height: "30px",
                display: "inline-block",
                border: "1px solid #333",
                borderRadius: "4px",
              }}
            />
          </p>
          <p style={{ textAlign: "center" }}>
            <input
              type="text"
              placeholder="商品折扣"
              ref="goodsdiscount"
              style={{
                textIndent: "1em",
                width: "80%",
                height: "30px",
                display: "inline-block",
                border: "1px solid #333",
                borderRadius: "4px",
              }}
            />
          </p>
        </Modal>
        <Table
          components={components}
          rowClassName={() => "editable-row"}
          bordered
          dataSource={dataSource}
          columns={columns}
        />
      </div>
    );
  }
}
