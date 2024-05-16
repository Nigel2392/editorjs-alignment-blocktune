/**
 * Build styles
 */

import './index.css';

export {
    AlignmentBlockTune,
    AlignmentType,  
};

function make(tagName: string, classNames: string | string[] = '', attributes: {[key: string]: string} = {}) {
    const el = document.createElement(tagName);
  
    if (Array.isArray(classNames)) {
      el.classList.add(...classNames);
    } else if (classNames) {
      el.classList.add(classNames);
    }
  
    for (const attrName in attributes) {
      el[attrName] = attributes[attrName];
    }
    return el;
}

type AlignmentType = 'left' | 'center' | 'right';

class AlignmentBlockTune {
    settings: {
        default: AlignmentType,
        blocks: {[key: string]: AlignmentType}
    };
    data: {
        alignment: AlignmentType
    };
    block: any;
    api: any;
    wrapper: HTMLElement;
    alignmentSettings: {name: AlignmentType, icon: string}[];
    _CSS: {
        alignment: {
            left: string,
            center: string,
            right: string
        }
    };

    /**
     *
     * @param api
     * @param data 既に設定されているデータ
     * @param settings tuneに設定項目
     * @param block tuneに設定されてるblock
     */
    constructor({ api, data, config, block}) {
        this.api = api;
        this.block = block;
        /**
         config:{
            default: "right",
            blocks: {
              header: 'center',
              list: 'right'
            }
          },
         */
        this.settings = config;
        this.data = data || { alignment: this.getAlignment() }
        this.alignmentSettings = [
            {
                name: 'left',
                icon: `<svg xmlns="http://www.w3.org/2000/svg" id="Layer" enable-background="new 0 0 64 64" height="20" viewBox="0 0 64 64" width="20"><path d="m54 8h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"/><path d="m54 52h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"/><path d="m10 23h28c1.104 0 2-.896 2-2s-.896-2-2-2h-28c-1.104 0-2 .896-2 2s.896 2 2 2z"/><path d="m54 30h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"/><path d="m10 45h28c1.104 0 2-.896 2-2s-.896-2-2-2h-28c-1.104 0-2 .896-2 2s.896 2 2 2z"/></svg>`
            },
            {
                name: 'center',
                icon: `<svg xmlns="http://www.w3.org/2000/svg" id="Layer" enable-background="new 0 0 64 64" height="20" viewBox="0 0 64 64" width="20"><path d="m54 8h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"/><path d="m54 52h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"/><path d="m46 23c1.104 0 2-.896 2-2s-.896-2-2-2h-28c-1.104 0-2 .896-2 2s.896 2 2 2z"/><path d="m54 30h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"/><path d="m46 45c1.104 0 2-.896 2-2s-.896-2-2-2h-28c-1.104 0-2 .896-2 2s.896 2 2 2z"/></svg>`
            },
            {
                name: 'right',
                icon: `<svg xmlns="http://www.w3.org/2000/svg" id="Layer" enable-background="new 0 0 64 64" height="20" viewBox="0 0 64 64" width="20"><path d="m54 8h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"/><path d="m54 52h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"/><path d="m54 19h-28c-1.104 0-2 .896-2 2s.896 2 2 2h28c1.104 0 2-.896 2-2s-.896-2-2-2z"/><path d="m54 30h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"/><path d="m54 41h-28c-1.104 0-2 .896-2 2s.896 2 2 2h28c1.104 0 2-.896 2-2s-.896-2-2-2z"/></svg>`
            }
        ];
        this._CSS = {
            alignment: {
                left: 'ce-tune-alignment--left',
                center: 'ce-tune-alignment--center',
                right: 'ce-tune-alignment--right',
            }
        }
    }

    static get DEFAULT_ALIGNMENT() {
        return 'left';
    }

    static get isTune() {
        return true;
    }

    getAlignment(){
        if ((this.constructor as any).blockAlignment) {
            let align = (this.constructor as any).blockAlignment;
            (this.constructor as any).blockAlignment = null;
            return align;
        }
        if(!!this.settings?.blocks && this.settings.blocks.hasOwnProperty(this.block.name)){
            return this.settings.blocks[this.block.name]
        }
        if(!!this.settings?.default){
            return this.settings.default
        }
        return AlignmentBlockTune.DEFAULT_ALIGNMENT
    }

    /**
     * block自体をwrapしてくれる
     * constructorで与えられたalignmentを代入しようとすると、holderが確定してなく
     * renderでやろうとすると、tuneを表示時に処理が走る
     * @param blockContent
     */
    wrap(blockContent) {
        this.wrapper = make("div");
        this.wrapper.classList.toggle(this._CSS.alignment[this.data.alignment])
        this.wrapper.append(blockContent)
        setTimeout(() => {
            this.api.listeners.on(this.block.holder, 'keydown', (e: KeyboardEvent) => {
                if (e.key === 'Enter') {
                    (this.constructor as any).blockAlignment = this.data.alignment;
                }
            });

        }, 0)
        return this.wrapper
    }

    /**
     * rendering block tune
     * @returns {*}
     */
    render() {
        const wrapper = make("div");
        this.alignmentSettings.map(align => {
            // Create button
            const button = document.createElement('button');
            button.classList.add(this.api.styles.settingsButton);
            button.innerHTML = align.icon;
            button.type = 'button';

            // Match current block's alignment to classnames
            button.classList.toggle(
                this.api.styles.settingsButtonActive,
                align.name === this.data.alignment,
            );

            // Initialize tooltip
            this.api.tooltip.onHover(
                button,
                this.api.i18n.t(`Align ${align.name}`),
                { placement: 'top', offset: 5 }
            );

            wrapper.appendChild(button);
            return button
        }).forEach((element, index, elements) => {
            element.addEventListener('click', () => {
                const direction = this.alignmentSettings[index].name;
                this.data = {
                    alignment: direction
                };
                elements.forEach((el, i) => {
                    const {name} = this.alignmentSettings[i];
                    el.classList.toggle(this.api.styles.settingsButtonActive, name === this.data.alignment);
                    //toggle alignment style class for block
                    this.wrapper.classList.toggle(this._CSS.alignment[name], name === this.data.alignment)
                });
                this.block.dispatchChange();
            });
        });
        return wrapper;
    }
    /**
     * save
     * @returns {*}
     */
    save() {
        return this.data;
    }
}

(window as any).AlignmentBlockTune = AlignmentBlockTune;
