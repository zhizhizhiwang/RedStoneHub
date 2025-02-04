from typing import List
import networkx


class VisitedListManager(object):

    def __init__(self):
        super().__init__()

        self.NodeList : List[str] = []
        self.NodeList.clear()
        self.graph = networkx.DiGraph()

    def append(self, item : str):

        if not self.graph.has_edge(self[-1], item):
            self.graph.add_edge(self[-1], item)
        self.NodeList.append(item)

        return self

    def __getitem__(self, item):
        return self.NodeList.__getitem__(item)

