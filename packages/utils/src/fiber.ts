import { Component } from "react";

/**
 * 查找满足条件的 fiber 和它的最外层 DOM
 * @param fiber
 * @returns
 */
export function findFiberAndElement(fiber, condition: (fiber) => boolean) {
  let element = null;
  while (fiber) {
    if (fiber.tag === 5) {
      element = fiber.stateNode;
    }
    fiber = fiber.return;
    if (condition(fiber)) {
      return { fiber, element };
    }
  }
  return { fiber: null, element: null };
}

/**
 * 获取设计信息
 * @param dom DOM节点
 * @param condition 条件
 * @returns node 鼠标所在节点
 */
export function findDesignInfoByDOM(dom: HTMLElement, condition: (fiber) => boolean): { element: HTMLElement; type: Component; id: string } {
  const __reactFiberPropty = Object.keys(dom).find((i) => i.startsWith("__reactFiber"));
  let component = findFiberAndElement(dom[__reactFiberPropty], condition);
  let parent = component;
  let container = null;
  while (parent.fiber) {
    if (!container && parent.fiber?.type.__isContainer__) {
      container = parent;
    }
    if (!container) {
      component = parent;
    }
    parent = findFiberAndElement(parent.fiber, condition);
  }
  return { element: component.element, type: component.fiber?.type, id: component.fiber?.key };
}
