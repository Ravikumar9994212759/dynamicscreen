import React, { Component } from 'react';
import { ListViewComponent } from "@syncfusion/ej2-react-lists";
import { PagerComponent } from "@syncfusion/ej2-react-grids"; 
import { DataManager, Query, JsonAdaptor } from "@syncfusion/ej2-data";

interface ListItem {
  name: string;
  phone_number: string;
  avatar: string;
  contact_id: string;
  [key: string]: string;
}

const PAGE_SIZE = 5;

class ListView extends Component {
  state = {
    dataSource: [],
    currentPage: 1,
    loading: true
  };

  async componentDidMount() {
    try {
      const response = await fetch("http://localhost:9356/QuaLIS/invoicecustomermaster/getlistview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const listRes = await response.json();
      this.setState({ dataSource: listRes, loading: false });
    } catch (error) {
      console.error("Error fetching data:", error);
      this.setState({ loading: false });
    }
  }

  handlePageChange = (args: any) => {
    const { currentPage, dataSource } = this.state;
    const startIndex = (args.currentPage - 1) * PAGE_SIZE;
    const endIndex = args.currentPage * PAGE_SIZE;
    const query = new Query().range(startIndex, endIndex);
    const dataManager = new DataManager({
      json: dataSource,
      adaptor: new JsonAdaptor(),
    });

    const pagedData = dataManager.executeLocal(query) as ListItem[];
    this.setState({ currentPage: args.currentPage, dataSource: pagedData });
  };

  render() {
    const { dataSource, currentPage, loading } = this.state;

    const fields = { text: 'name' };
    const listTemplate = (data: ListItem) => (
      <div className="e-list-wrapper e-list-multi-line">
        <div className="e-list-item-details">
          <span className="e-list-item-header">{data.name}</span>
          <span className="e-list-content">{data.phone_number}</span>
        </div>
      </div>
    );

    if (loading) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        <ListViewComponent
          id="list"
          dataSource={dataSource}
          fields={fields}
          template={listTemplate}
          width="300px"
          cssClass="e-list-template"
          height="450px"
        />
        <PagerComponent
          totalRecordsCount={dataSource.length}
          pageSize={PAGE_SIZE}
          currentPage={currentPage}
          click={this.handlePageChange}
        />
      </div>
    );
  }
}

export default ListView;
