import * as React from 'react';
import { truncateStr } from '../../common/helpers/truncate-str';
import { store } from '../../common/store';
import { Label } from '../label/label';
import { ViewDidDialog } from '../view-did-dialog/view-did-dialog';

export class HolderTable extends React.Component<any, any> {
    private storeChangeSubscription: any;

    constructor(props: any) {
        super(props);

        const storeState = store.getState();
        this.state = {
            list: storeState.holder.requests as any[],
            considerVpRequest: null
        } as any;
        console.log(storeState.holder.requests);
    }

    componentDidMount() {
        this.storeChangeSubscription = store.subscribe(() => {
            const storeState = store.getState();
            this.setState(() => {
                return {
                    ...this.state,
                    list: storeState.holder.requests as any[],
                }
            });
        });
    }

    componentWillUnmount() {
        this.storeChangeSubscription && this.storeChangeSubscription();
        this.storeChangeSubscription = null;
    }

    onConsiderButtonClick(vpRequest: any) {
        return () => {
            this.setState({
                ...this.state,
                considerVpRequest: vpRequest
            })
        }
    }

    onViewDidDialogClose = () => {
        this.setState({
            ...this.state,
            considerVpRequest: null
        });
    }

    render() {
        return (
            <>
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th scope="col">State</th>
                            <th scope="col">Requester</th>
                            <th scope="col">Description</th>
                            <th scope="col">VC ID</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state &&
                            this.state.list.map((item: any, index) => {
                                return <tr key={'row-' + index}>
                                    <th>
                                        {!item.status && <Label name="Pending" color="second"></Label>}
                                        {item.status == 1 && <Label name="Approved" color="success"></Label>}
                                        {item.status == 2 && <Label name="Rejected" color="danger"></Label>}
                                    </th>
                                    <td>{truncateStr(item.iss, 27)}</td>
                                    <td>-</td>
                                    <td>{truncateStr(item.ipfsHash)}</td>
                                    <td>
                                        <button className="button primary button-sm me-2 float-end" onClick={this.onConsiderButtonClick(item)}>Consider</button>
                                    </td>
                                </tr>
                            })}
                    </tbody>
                </table>
                {!!this.state.considerVpRequest &&
                    <ViewDidDialog vpRequest={this.state.considerVpRequest} onClose={this.onViewDidDialogClose}></ViewDidDialog>
                }
            </>
        );
    }

    private toggleDidDialog(viewDialogOpenned: boolean) {
        this.setState({
            ...this.state,
            viewDialogOpenned
        });
    }
}
