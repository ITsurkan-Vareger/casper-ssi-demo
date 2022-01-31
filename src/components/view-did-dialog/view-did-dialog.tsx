import * as React from 'react';
import ReactModal from 'react-modal';
import DATA_FIELDS_SHEMA from '../../common/data-fields-shema';
import { store } from '../../common/store';
import { Button } from '../button/button';
import { InputField } from "../input-field/input-field";
import { ViewDidDialogProps } from "./view-did-dialog-props";
import "./view-did-dialog.scss";

ReactModal.defaultStyles = {}

type ViewDidDialogState = { data: Array<{ title: string, items: { title: string, field: string, value: string }[] }> };

export class ViewDidDialog extends React.Component<ViewDidDialogProps, ViewDidDialogState> {
    togle = {
        personal: true,
        education: true
    };

    constructor(props: ViewDidDialogProps) {
        super(props);

        this.state = { data: this.mapData(this.props.vpRequest) };
    }

    changeChecked = (event, key, prop) => {
        //this.setState({ ...this.state, [key]: { ...this.state[key], [prop]: { checked: event.target.checked } } })
    }

    render() {
        return (
            <ReactModal className="view-did-dialog d-flex flex-column justify-content-between"
                isOpen={true}>
                <div className="overflow-auto scroll-hide field-box">

                    <h5 className="fw-bold mb-3 mt-2">VC Request permission</h5>

                    {this.state.data.map((category, index) =>
                        <div className="mb-3" key={'category-' + index}>

                            <div className="d-flex flex-row justify-content-between mb-2">
                                <div className="fw-bold ">{category.title}</div>
                            </div>
                            {category.items.map((item, itemIndex) => <InputField key={'item-' + itemIndex} label={item.title} value={item.value} className="mb-2" />)}
                        </div>
                    )}
                </div>
                <div className="d-flex justify-content-end align-items-center btn-box">

                    <Button onClick={this.onCancelButtonClick} className="m-lg-1">Cancel</Button>
                    <Button onClick={this.onCancelButtonClick} className="ms-2 bg-danger text-white">Reject the entire
                        request</Button>
                    <Button color="primary" className="m-lg-1" onClick={this.onSubmitButtonClick}>Revoke</Button>

                </div>
            </ReactModal>
        );
    }

    private onCancelButtonClick = () => {
        this.emitCloseEvent();
    }

    private onSubmitButtonClick = () => {
        this.emitCloseEvent();
    }

    private emitCloseEvent(data?: any) {
        if (this.props.onClose) {
            this.props.onClose(data);
        }
    }

    private mapData(vcRequest: any): any {
        const categories = DATA_FIELDS_SHEMA.filter(group => vcRequest.claims.some(c => group.items.some(t => !!t[c.claimType])));
        console.log(categories);
        const result = categories.map(c => {
            const items: any = [];
            c.items.forEach(t => {
                const entries = Object.entries(t)[0];
                const value = this.findValueByField(entries[0]);
                if (value) {
                    items.push({ title: entries[1], field: entries[0], value });
                }
            })
            return {
                title: c.title,
                items
            }
        })
            .filter(t => !!t.items.length);
        return result;
    }

    private findValueByField(field: string): string | null {
        const state = store.getState();
        const vc = state.holder?.vcs.find(t => t.credentialSubject[field]);
        return vc?.credentialSubject[field] || null;
    }
}
