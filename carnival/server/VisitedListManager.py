from typing import List
import networkx
import logging
import matplotlib.pyplot as pyplot
logging.getLogger('matplotlib').setLevel(logging.INFO)
class VisitedListManager(object):

    def __init__(self):
        super().__init__()

        self.NodeList : List[str] = ["start"]
        self.graph = networkx.DiGraph()

    def append(self, item : str):

        if not self.graph.has_edge(self[-1], item):
            self.graph.add_edge(self[-1], item)
        self.NodeList.append(item)

        return self

    def __getitem__(self, item):
        return self.NodeList.__getitem__(item)

    def show_graph(self):
#       pos = networkx.kamada_kawai_layout(self.graph)
        pos = networkx.spring_layout(self.graph)

        networkx.draw(self.graph, pos, with_labels=True, arrows=True)

        pyplot.show()

    def crash(self):
        logging.debug("CRASH")
